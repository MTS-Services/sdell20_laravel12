<?php

return [
    'username' => env('CLICKSEND_USERNAME'),
    'api_key' => env('CLICKSEND_API_KEY'),
    'sender_id' => env('CLICKSEND_SENDER_ID', 'MyApp'),
    'base_url' => 'https://rest.clicksend.com/v3',
    'webhook_secret' => env('CLICKSEND_WEBHOOK_SECRET'),
    'timeout' => 10,

    /**
     * Supported countries for SMS sending.
     * Each country includes its country code and validation pattern.
     */
    'supported_countries' => [
        'UK' => [
            'code' => '+44',
            'name' => 'United Kingdom',
            'pattern' => '/^\+44[1-9]\d{8,9}$/',
            'example' => '+447123456789',
        ],
        'BD' => [
            'code' => '+880',
            'name' => 'Bangladesh',
            'pattern' => '/^\+8801[3-9]\d{8}$/',
            'example' => '+8801712345678',
        ],
    ],
];
