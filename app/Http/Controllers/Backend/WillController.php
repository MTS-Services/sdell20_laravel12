<?php

namespace App\Http\Controllers\Backend;

use App\Enums\PaymentProduct;
use App\Http\Controllers\Controller;
use App\Models\Will;
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

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Will created successfully.',
                'data' => [
                    'will_id' => $will->id,
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
