<?php

use App\Http\Controllers\Webhooks\ClickSendDeliveryController;
use Illuminate\Support\Facades\Route;

Route::post('/webhooks/clicksend/delivery', ClickSendDeliveryController::class)
    ->name('webhooks.clicksend.delivery');
