<?php

namespace App\Http\Controllers\Backend;

use App\Enums\PaymentProduct;
use App\Http\Controllers\Controller;
use App\Models\Lpa;
use App\Services\LpaPdfService;
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

    public function __construct(
        private readonly LpaPdfService $pdfService
    ) {}

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
            'document_type' => 'required|in:property,health',
            'donor_details' => 'required|array',
            'contact_details' => 'required|array',
            'attorneys' => 'required|array|min:1',
            'can_view_documents' => 'nullable|boolean',
            'replacement_attorneys' => 'nullable|array',
            'want_replacement_attorneys' => 'nullable|boolean',
            'life_sustaining_treatment' => 'nullable|boolean',
            'notify_people' => 'nullable|boolean',
            'applicant' => 'nullable|string',
            'document_recipient' => 'nullable|string',
            'certificate_choice' => 'nullable|boolean',
        ]);

        try {
            DB::beginTransaction();

            // Create LPA record
            $lpa = Lpa::create([
                'user_id' => Auth::id(),
                ...$validated,
                'status' => 'draft',
                'is_draft' => true,
                'amount' => $this->calculateAmount($validated['document_type']),
            ]);

            // Generate PDF automatically
            $this->pdfService->generatePdf($lpa);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'LPA created successfully. PDF generated in draft status.',
                'data' => [
                    'lpa_id' => $lpa->id,
                    'pdf_path' => $lpa->pdf_path,
                    'is_draft' => $lpa->is_draft,
                    'amount' => $lpa->amount,
                ],
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create LPA: '.$e->getMessage(),
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

    public function downloadPdf(Lpa $lpa)
    {
        $this->authorize('view', $lpa);

        // Only allow download of final PDF if the LPA has been paid for
        if ($lpa->isDraft()) {
            return response()->json([
                'success' => false,
                'message' => 'Payment required to download the final PDF. You can only preview the draft version.',
            ], 402);
        }

        return $this->pdfService->downloadPdf($lpa);
    }

    public function previewPdf(Lpa $lpa)
    {
        $this->authorize('view', $lpa);

        // Preview always shows the current version (draft watermark if unpaid)
        return $this->pdfService->streamPdf($lpa);
    }

    public function regeneratePdf(Lpa $lpa): JsonResponse
    {
        $this->authorize('update', $lpa);

        try {
            $this->pdfService->regeneratePdf($lpa);

            return response()->json([
                'success' => true,
                'message' => 'PDF regenerated successfully.',
                'pdf_path' => $lpa->fresh()->pdf_path,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to regenerate PDF: '.$e->getMessage(),
            ], 500);
        }
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

            // Regenerate PDF without draft watermark
            $this->pdfService->removeDraftWatermark($lpa);

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
                'message' => 'Payment processing failed: '.$e->getMessage(),
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
        // Set pricing based on document type
        return match ($documentType) {
            'property' => 139.99,
            'health' => 139.99,
            default => 139.99,
        };
    }
}
