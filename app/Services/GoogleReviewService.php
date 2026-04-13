<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GoogleReviewService
{
    /**
     * @return array{reviews: array, rating: ?float, user_ratings_total: ?int}
     */
    public function getPlaceReviewPayload(): array
    {
        // return Cache::remember('google_place_reviews', now()->addHours(6), function () {

        $response = Http::get(
            'https://maps.googleapis.com/maps/api/place/details/json',
            [
                'place_id' => config('services.google.place_id'),
                'fields' => 'reviews,rating,user_ratings_total',
                'key' => config('services.google.api_key'),
            ]
        );

        if (! $response->successful()) {
            return [
                'reviews' => [],
                'rating' => null,
                'user_ratings_total' => null,
            ];
        }

        $result = $response->json('result', []);

        return [
            'reviews' => is_array($result['reviews'] ?? null) ? $result['reviews'] : [],
            'rating' => isset($result['rating']) ? (float) $result['rating'] : null,
            'user_ratings_total' => isset($result['user_ratings_total']) ? (int) $result['user_ratings_total'] : null,
        ];

        // });
    }

    public function getReviews(): array
    {
        return $this->getPlaceReviewPayload()['reviews'];
    }
}
