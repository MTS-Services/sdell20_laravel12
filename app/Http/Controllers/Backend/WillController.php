<?php

namespace App\Http\Controllers\Backend;

use App\Enums\PaymentProduct;
use App\Http\Controllers\Controller;
use App\Models\Will;
use App\Services\WillPdfService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class WillController extends Controller
{
    use AuthorizesRequests;

    public function __construct(
        private readonly WillPdfService $pdfService
    ) {}

    public function index(): Response
    {
        $wills = Will::where('user_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('backend/User/WillIndex', [
            'wills' => $wills,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate($this->willValidationRules());

        try {
            DB::beginTransaction();

            $will = Will::create([
                'user_id' => Auth::id(),
                ...$validated,
                'status' => 'draft',
                'is_draft' => true,
                'amount' => $this->calculateAmount($validated['will_type']),
            ]);

            // Generate PDF automatically
            $this->pdfService->generatePdf($will);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Will created successfully. PDF generated in draft status.',
                'data' => [
                    'will_id' => $will->id,
                    'pdf_path' => $will->pdf_path,
                    'is_draft' => $will->is_draft,
                    'amount' => $will->amount,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create Will: '.$e->getMessage(),
            ], 500);
        }
    }

    public function saveDraft(Request $request): JsonResponse
    {
        $rules = $this->willValidationRules();
        $validated = $request->validate($rules + [
            'will_id' => 'nullable|integer',
        ]);

        $willId = $validated['will_id'] ?? null;
        unset($validated['will_id']);

        $payload = array_merge($validated, [
            'user_id' => Auth::id(),
            'status' => 'draft',
            'is_draft' => true,
            'amount' => $this->calculateAmount($validated['will_type']),
        ]);

        try {
            DB::beginTransaction();

            $will = null;

            if ($willId) {
                $will = Will::where('id', $willId)
                    ->where('user_id', Auth::id())
                    ->first();
            }

            if ($will) {
                $will->update($payload);
            } else {
                $will = Will::create($payload);
            }

            // Generate PDF automatically
            $this->pdfService->generatePdf($will);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Will saved successfully.',
                'data' => [
                    'will_id' => $will->id,
                    'is_draft' => $will->is_draft,
                    'amount' => $will->amount,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to save Will: '.$e->getMessage(),
            ], 500);
        }
    }

    public function show(Will $will): Response
    {
        $this->authorize('view', $will);

        $product = PaymentProduct::fromWillType($will->will_type);
        $hasPaid = $will->isPaid();

        return Inertia::render('backend/User/WillShow', [
            'will' => $will->load('user'),
            'hasPaid' => $hasPaid,
            'product' => $product->value,
            'amount' => $product->amountInPence(),
        ]);
    }

    public function destroy(Will $will): RedirectResponse
    {
        $this->authorize('delete', $will);

        $will->delete();

        return redirect()->route('wills.index')
            ->with('success', 'Will deleted successfully.');
    }

    public function downloadPdf(Will $will)
    {
        $this->authorize('view', $will);

        // Only allow download of final PDF if the Will has been paid for
        if ($will->isDraft()) {
            return response()->json([
                'success' => false,
                'message' => 'Payment required to download the final PDF. You can only preview the draft version.',
            ], 402);
        }

        return $this->pdfService->downloadPdf($will);
    }

    public function previewPdf(Will $will)
    {
        $this->authorize('view', $will);

        // Preview always shows the current version (draft watermark if unpaid)
        return $this->pdfService->streamPdf($will);
    }

    public function regeneratePdf(Will $will): JsonResponse
    {
        $this->authorize('update', $will);

        try {
            $this->pdfService->regeneratePdf($will);

            return response()->json([
                'success' => true,
                'message' => 'PDF regenerated successfully.',
                'pdf_path' => $will->fresh()->pdf_path,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to regenerate PDF: '.$e->getMessage(),
            ], 500);
        }
    }

    public function processPayment(Request $request, Will $will): JsonResponse
    {
        $this->authorize('update', $will);

        $validated = $request->validate([
            'payment_reference' => 'required|string',
            'payment_method' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            // Mark as paid and remove draft status
            $will->markAsPaid($validated['payment_reference']);

            // Regenerate PDF without draft watermark
            $this->pdfService->removeDraftWatermark($will);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully. Draft status removed.',
                'data' => [
                    'will_id' => $will->id,
                    'is_draft' => false,
                    'status' => 'completed',
                    'paid_at' => $will->paid_at,
                ],
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Payment processing failed: '.$e->getMessage(),
            ], 500);
        }
    }

    private function calculateAmount(string $willType): float
    {
        return match ($willType) {
            'Me' => 69.99,
            'Mirror' => 99.99,
            default => 69.99,
        };
    }

    private function willValidationRules(): array
    {
        return [
            'will_type' => 'required|in:Me,Mirror',
            'personal_info' => 'required|array',
            'spouse' => 'nullable|array',
            'executors' => 'nullable|array',
            'alternate_executors' => 'nullable|array',
            'children' => 'nullable|array',
            'guardians' => 'nullable|array',
            'beneficiaries' => 'nullable|array',
            'specific_gifts' => 'nullable|array',
            'total_failure_beneficiaries' => 'nullable|array',
            'pets' => 'nullable|array',
            'additional_clauses' => 'nullable|array',
            'signing_timeline' => 'nullable|string',
            'signing_date' => 'nullable|date',
            'signing_city' => 'nullable|string',
            'signing_country' => 'nullable|string',
            'form_data' => 'nullable|array',
        ];
    }
}
