<?php

namespace App\Http\Controllers;

use App\Enums\PaymentProduct;
use App\Enums\PaymentStatus;
use App\Http\Requests\Payment\ConfirmPaymentRequest;
use App\Http\Requests\Payment\CreatePaymentIntentRequest;
use App\Http\Requests\Payment\SelectPlanRequest;
use App\Mail\PaymentCompletedEmail;
use App\Models\Payment;
use App\Services\LpaPdfService;
use App\Services\Payment\PaymentIntentClientInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    public function __construct(
        private PaymentIntentClientInterface $paymentIntentClient
    ) {}

    /**
     * Store selected plan (amount) when user clicks a pricing card. Saves Payment with enum status.
     */
    public function selectPlan(SelectPlanRequest $request): JsonResponse
    {
        $metadata = [];
        if ($request->filled('product')) {
            $metadata['product'] = $request->validated('product');
        }

        $payment = Payment::query()->create([
            'user_id' => $request->user()->id,
            'stripe_payment_intent_id' => null,
            'amount' => $request->validated('amount'),
            'currency' => 'gbp',
            'status' => PaymentStatus::Pending,
            'metadata' => ! empty($metadata) ? $metadata : null,
        ]);

        return response()->json([
            'payment_id' => $payment->id,
            'amount' => $payment->amount,
            'currency' => $payment->currency,
        ]);
    }

    /**
     * Show the checkout page.
     */
    public function checkout(Request $request): Response
    {
        $amount = (int) $request->query('amount', PaymentProduct::LpaProperty->amountInPence());
        $currency = $request->query('currency', 'gbp');
        $paymentId = $request->query('payment_id');
        $product = $request->query('product');
        $redirectUrl = $request->query('redirect_url');

        return Inertia::render('Checkout', [
            'amount' => $amount,
            'currency' => $currency,
            'paymentId' => $paymentId ? (int) $paymentId : null,
            'product' => $product,
            'redirectUrl' => $redirectUrl,
        ]);
    }

    /**
     * Create a PaymentIntent and return clientSecret. Reuses one existing pending payment so only one row is stored; idempotent when payment_id already has an intent (e.g. duplicate frontend call).
     */
    public function createIntent(CreatePaymentIntentRequest $request): JsonResponse
    {
        $userId = $request->user()->id;
        $amount = $request->validated('amount');
        $paymentId = $request->validated('payment_id');

        if ($paymentId) {
            $existing = Payment::query()
                ->where('id', $paymentId)
                ->where('user_id', $userId)
                ->first();
            if ($existing && $existing->stripe_payment_intent_id) {
                $intent = $this->paymentIntentClient->retrieve($existing->stripe_payment_intent_id);

                return response()->json(['clientSecret' => $intent->client_secret]);
            }
        }

        $payment = null;
        if ($paymentId) {
            $payment = Payment::query()
                ->where('id', $paymentId)
                ->where('user_id', $userId)
                ->whereNull('stripe_payment_intent_id')
                ->first();
        }
        if (! $payment) {
            $payment = Payment::query()
                ->where('user_id', $userId)
                ->whereNull('stripe_payment_intent_id')
                ->latest()
                ->first();
        }

        $intent = $this->paymentIntentClient->create([
            'amount' => $amount,
            'currency' => 'gbp',
            'payment_method_types' => ['card'],
        ]);

        $status = PaymentStatus::storeFromStripe($intent->status);

        if ($payment instanceof Payment) {
            $payment->update([
                'stripe_payment_intent_id' => $intent->id,
                'amount' => $intent->amount,
                'currency' => $intent->currency,
                'status' => $status,
            ]);
        } else {
            Payment::query()->create([
                'user_id' => $userId,
                'stripe_payment_intent_id' => $intent->id,
                'amount' => $intent->amount,
                'currency' => $intent->currency,
                'status' => $status,
            ]);
        }

        return response()->json(['clientSecret' => $intent->client_secret]);
    }

    /**
     * Verify payment succeeded and fulfill the order.
     */
    public function confirmPayment(ConfirmPaymentRequest $request): JsonResponse
    {
        $paymentIntentId = $request->validated('payment_intent_id');
        $intent = $this->paymentIntentClient->retrieve($paymentIntentId);

        $payment = Payment::query()
            ->where('stripe_payment_intent_id', $paymentIntentId)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($payment instanceof Payment) {
            $wasCompleted = $payment->isCompleted();
            $status = PaymentStatus::storeFromStripe($intent->status);
            Payment::query()->whereKey($payment->getKey())->update(['status' => $status]);

            if ($status->isComplete() && ! $wasCompleted) {
                Mail::to($request->user())->queue(
                    (new PaymentCompletedEmail($payment->fresh()))->delay(now()->addSecond())
                );
            }

            // If payment succeeded and it's for an LPA, mark the LPA as paid
            if ($status->isComplete()) {
                $this->fulfillLpaPayment($payment, $request->user());
            }
        }

        if (PaymentStatus::storeFromStripe($intent->status)->isComplete()) {
            $redirectUrl = $request->input('redirect_url');

            return response()->json([
                'message' => 'Payment successful!',
                'redirect_url' => $redirectUrl,
            ]);
        }

        return response()->json(['message' => 'Payment not completed.'], 422);
    }

    /**
     * Process payment for Will Writing Online platform purchase.
     */
    public function processPlatformPayment(Request $request): JsonResponse
    {
        $product = PaymentProduct::WillWritingPlatform;
        $amount = $product->amountInPence();

        $metadata = [
            'product' => $product->value,
        ];

        $payment = Payment::query()->create([
            'user_id' => $request->user()->id,
            'stripe_payment_intent_id' => null,
            'amount' => $amount,
            'currency' => 'gbp',
            'status' => PaymentStatus::Pending,
            'metadata' => $metadata,
        ]);

        $checkoutUrl = route('checkout', [
            'amount' => $amount,
            'currency' => 'gbp',
            'payment_id' => $payment->id,
            'product' => $product->value,
            'redirect_url' => route('dashboard'),
        ]);

        return response()->json([
            'payment_id' => $payment->id,
            'checkout_url' => $checkoutUrl,
        ]);
    }

    /**
     * If the payment is for an LPA product, mark the associated LPA as paid and regenerate PDF.
     */
    private function fulfillLpaPayment(Payment $payment, $user): void
    {
        $product = $payment->getProduct();

        if (! $product?->isLpa()) {
            return;
        }

        $documentType = match ($product) {
            PaymentProduct::LpaProperty => 'property',
            PaymentProduct::LpaBoth => 'both',
            default => 'health',
        };

        $lpa = $user->lpas()
            ->where('document_type', $documentType)
            ->where('is_draft', true)
            ->latest()
            ->first();

        if ($lpa) {
            $lpa->markAsPaid($payment->stripe_payment_intent_id);

            $pdfService = app(LpaPdfService::class);
            $pdfService->removeDraftWatermark($lpa);
        }
    }
}
