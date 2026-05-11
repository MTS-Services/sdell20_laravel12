<?php

namespace App\Http\Controllers\Backend;

use App\Enums\PaymentProduct;
use App\Http\Controllers\Controller;
use App\Models\Lpa;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LpaController extends Controller
{
    use AuthorizesRequests;

    public function create(): Response
    {
        return Inertia::render('backend/User/LpaCreate', [
            'user' => Auth::user(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'who_for' => 'required|in:Me,Mirror',
            'document_type' => 'required|in:property,health,both',
            'donor_details' => 'required|array',
            'contact_details' => 'required|array',
            'attorneys' => 'nullable|array',
            'can_view_documents' => 'nullable|boolean',
            'replacement_attorneys' => 'nullable|array',
            'want_replacement_attorneys' => 'nullable|boolean',
            'life_sustaining_treatment' => 'nullable|boolean',
            'notify_people' => 'nullable|boolean',
            'applicant' => 'nullable|string',
            'document_recipient' => 'nullable|string',
            'certificate_choice' => 'nullable|boolean',
            'lp1h_form' => 'nullable|array',
            'lp1h_form.attorney_acting' => 'nullable|string|in:jointly_and_severally,jointly,mixed,single_attorney',
            'lp1h_form.when_attorneys_can_act' => 'nullable|string|in:as_soon_registered,only_without_capacity',
            'lp1h_form.preferences' => 'nullable|string|max:20000',
            'lp1h_form.instructions' => 'nullable|string|max:20000',
            'lp1h_form.people_to_notify' => 'nullable|array|max:5',
            'lp1h_form.people_to_notify.*.title' => 'nullable|string|max:20',
            'lp1h_form.people_to_notify.*.firstName' => 'nullable|string|max:120',
            'lp1h_form.people_to_notify.*.lastName' => 'nullable|string|max:120',
            'lp1h_form.people_to_notify.*.addressLine1' => 'nullable|string|max:200',
            'lp1h_form.people_to_notify.*.postcode' => 'nullable|string|max:20',
            'lp1h_form.life_sustaining' => 'nullable|array',
            'lp1h_form.section_9' => 'nullable|array',
            'lp1h_form.certificate_provider' => 'nullable|array',
            'lp1h_form.attorney_deed_signatures' => 'nullable|array',
            'lp1h_form.section_15' => 'nullable|array',
            'lp1h_form.recipient_other' => 'nullable|array',
            'lp1h_form.recipient_contact_prefs' => 'nullable|array',
            'lp1h_form.complete_signatures_on_paper' => 'nullable|boolean',
        ]);

        try {
            DB::beginTransaction();

            $product = PaymentProduct::fromLpaType($validated['document_type']);

            // Create LPA record
            $lpa = Lpa::create([
                'user_id' => Auth::id(),
                ...$validated,
                'status' => 'draft',
                'is_draft' => true,
                'amount' => $this->calculateAmount($validated['document_type']),
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'LPA created successfully.',
                'data' => [
                    'lpa_id' => $lpa->id,
                    'is_draft' => $lpa->is_draft,
                    'amount' => $lpa->amount,
                    'checkout_amount_pence' => $product->amountInPence(),
                    'checkout_product' => $product->value,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create LPA: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function show(Lpa $lpa): Response
    {
        $this->authorize('view', $lpa);

        $product = PaymentProduct::fromLpaType($lpa->document_type);
        $hasPaid = $lpa->isPaid();

        return Inertia::render('backend/User/LpaShow', [
            'lpa' => $lpa->load('user'),
            'hasPaid' => $hasPaid,
            'product' => $product->value,
            'amount' => $product->amountInPence(),
        ]);
    }

    public function thankYou(Lpa $lpa): Response|RedirectResponse
    {
        $this->authorize('view', $lpa);

        if (! $lpa->isPaid()) {
            return redirect()->route('lpas.show', $lpa);
        }

        return Inertia::render('backend/User/LpaThankYou', [
            'lpa' => $lpa->load('user'),
            'supportEmail' => config('mail.from.address'),
        ]);
    }

    public function processPayment(Request $request, Lpa $lpa): JsonResponse
    {
        $this->authorize('update', $lpa);

        $validated = $request->validate([
            'payment_reference' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // Mark as paid and remove draft status
            $lpa->markAsPaid($validated['payment_reference']);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully. Draft status removed.',
                'data' => [
                    'lpa_id' => $lpa->id,
                    'is_draft' => false,
                    'status' => 'completed',
                    'paid_at' => $lpa->paid_at,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Payment processing failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    public function index(): Response
    {
        $lpas = Lpa::where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('backend/User/LpaIndex', [
            'lpas' => $lpas,
        ]);
    }

    public function destroy(Lpa $lpa): RedirectResponse
    {
        $this->authorize('delete', $lpa);

        $lpa->delete();

        return redirect()->route('lpas.index')
            ->with('success', 'LPA deleted successfully.');
    }

    private function calculateAmount(string $documentType): float
    {
        $product = PaymentProduct::fromLpaType($documentType);

        return round($product->amountInPence() / 100, 2);
    }
}
