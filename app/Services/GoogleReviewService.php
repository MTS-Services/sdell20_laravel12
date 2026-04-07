<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class GoogleReviewService
{
    public function getReviews(): array
    {
        // return Cache::remember('google_reviews', now()->addHours(6), function () {

        $response = Http::get(
            'https://maps.googleapis.com/maps/api/place/details/json',
            [
                'place_id' => config('services.google.place_id'),
                'fields' => 'reviews,rating,user_ratings_total',
                'key' => config('services.google.api_key'),
            ]
        );
        if (!$response->successful()) {
            return [];
        }

        return $response->json('result.reviews', []);
        // });
    }
}
