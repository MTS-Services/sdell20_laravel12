<?php

namespace App\Http\Controllers;

use App\Enums\PaymentProduct;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentVerificationController extends Controller
{
    /**
     * Check if the authenticated user has a completed payment for a specific product.
     */
    public function check(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product' => ['required', 'string'],
        ]);

        $product = PaymentProduct::tryFrom($validated['product']);

        if (! $product) {
            return response()->json([
                'paid' => false,
                'message' => 'Invalid product type.',
            ], 422);
        }

        $user = $request->user();
        $hasPaid = $user->hasPaymentFor($product);
        $payment = $hasPaid ? $user->getPaymentFor($product) : null;

        return response()->json([
            'paid' => $hasPaid,
            'product' => $product->value,
            'product_label' => $product->label(),
            'amount' => $product->amountInPence(),
            'payment_id' => $payment?->id,
        ]);
    }
}
