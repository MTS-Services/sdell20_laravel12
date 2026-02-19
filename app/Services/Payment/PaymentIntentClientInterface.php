<?php

namespace App\Services\Payment;

interface PaymentIntentClientInterface
{
    /**
     * Create a PaymentIntent. Returned object must have: id, client_secret, amount, currency, status.
     *
     * @param  array<string, mixed>  $params
     */
    public function create(array $params): object;

    /**
     * Retrieve a PaymentIntent by ID. Returned object must have: id, status.
     */
    public function retrieve(string $id): object;
}
