<?php

namespace App\Services\Payment;

use Stripe\PaymentIntent as StripePaymentIntent;
use Stripe\Stripe;

class StripePaymentIntentClient implements PaymentIntentClientInterface
{
    public function __construct(string $apiKey)
    {
        Stripe::setApiKey($apiKey);
    }

    /**
     * @param  array<string, mixed>  $params
     */
    public function create(array $params): object
    {
        return StripePaymentIntent::create($params);
    }

    public function retrieve(string $id): object
    {
        return StripePaymentIntent::retrieve($id);
    }
}
