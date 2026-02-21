<?php

return [
    'username' => env('CLICKSEND_USERNAME'),
    'api_key' => env('CLICKSEND_API_KEY'),
    'sender_id' => env('CLICKSEND_SENDER_ID', 'MyApp'),
    'base_url' => 'https://rest.clicksend.com/v3',
    'webhook_secret' => env('CLICKSEND_WEBHOOK_SECRET'),
    'timeout' => 10,
];
