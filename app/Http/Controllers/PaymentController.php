<?php

namespace App\Http\Controllers;

use App\Enums\PaymentStatus;
use App\Http\Requests\Payment\ConfirmPaymentRequest;
use App\Http\Requests\Payment\CreatePaymentIntentRequest;
use App\Http\Requests\Payment\SelectPlanRequest;
use App\Models\Payment;
use App\Services\Payment\PaymentIntentClientInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
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
        $payment = Payment::query()->create([
            'user_id' => $request->user()->id,
            'stripe_payment_intent_id' => null,
            'amount' => $request->validated('amount'),
            'currency' => 'gbp',
            'status' => PaymentStatus::Pending,
            'metadata' => $request->filled('product')
                ? ['product' => $request->validated('product')]
                : null,
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
        $amount = (int) $request->query('amount', 9900);
        $currency = $request->query('currency', 'gbp');
        $paymentId = $request->query('payment_id');

        return Inertia::render('Checkout', [
            'amount' => $amount,
            'currency' => $currency,
            'paymentId' => $paymentId ? (int) $paymentId : null,
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

        if ($payment) {
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
    public function confirmPayment(ConfirmPaymentRequest $request): \Illuminate\Http\JsonResponse
    {
        $paymentIntentId = $request->validated('payment_intent_id');
        $intent = $this->paymentIntentClient->retrieve($paymentIntentId);

        $payment = Payment::query()
            ->where('stripe_payment_intent_id', $paymentIntentId)
            ->where('user_id', $request->user()->id)
            ->first();

        if ($payment) {
            $status = PaymentStatus::storeFromStripe($intent->status);
            $payment->update(['status' => $status]);
        }

        if ($intent->status === 'succeeded') {
            return response()->json(['message' => 'Payment successful!']);
        }

        return response()->json(['message' => 'Payment not completed.'], 422);
    }
}
