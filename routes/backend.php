<?php

use App\Http\Controllers\Backend\Admin\AdminDashboardController;
use App\Http\Controllers\Backend\Admin\AdminUserController;
use App\Http\Controllers\Backend\Admin\TwilioController;
use App\Http\Controllers\Backend\LpaController;
use App\Http\Controllers\Backend\WillController;
use App\Http\Controllers\Backend\User\UserDashboardController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PaymentVerificationController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\UserSelectionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Payment Routes
    Route::get('/checkout', [PaymentController::class, 'checkout'])->name('checkout');
    Route::post('/payment/select-plan', [PaymentController::class, 'selectPlan'])->name('payment.select-plan');
    Route::post('/payment/intent', [PaymentController::class, 'createIntent']);
    Route::post('/payment/confirm', [PaymentController::class, 'confirmPayment']);
    Route::post('/payment/verify', [PaymentVerificationController::class, 'check'])->name('payment.verify');

    // Dashboard Routes
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/form', [UserDashboardController::class, 'form'])->name('dashboard.form');
    Route::get('/dashboard/user', [UserDashboardController::class, 'dashboard'])->name('dashboard.user');
    Route::get('/dashboard/lpa/create', [UserDashboardController::class, 'lpaCreate'])->name('dashboard.lpa.create');
    Route::post('/dashboard/complete', [UserDashboardController::class, 'complete'])->name('dashboard.complete');

    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
        Route::resource('users', AdminUserController::class);
        Route::get('/users/list', [UserSelectionController::class, 'getUsers'])->name('users.list');

        // Twilio SMS Routes
        Route::prefix('twilio')->name('twilio.')->group(function () {
            Route::get('/', [TwilioController::class, 'index'])->name('index');
            Route::get('/bulk', [TwilioController::class, 'bulkIndex'])->name('bulk.index');
            Route::get('/campaign/{id}', [TwilioController::class, 'campaignShow'])->name('campaign.show');

            Route::post('/send-sms', [TwilioController::class, 'sendSms'])->name('sendSms');

            Route::post('/bulk/upload-csv', [TwilioController::class, 'bulkUploadCsv'])->name('bulk.uploadCsv');
            Route::post('/bulk/manual', [TwilioController::class, 'bulkManual'])->name('bulk.manual');

            Route::get('/campaign/{id}/status', [TwilioController::class, 'campaignStatus'])->name('campaign.status');
            Route::get('/csv-template', [TwilioController::class, 'downloadCsvTemplate'])->name('csvTemplate');
        });
    });

    // LPA Routes
    Route::prefix('lpas')->name('lpas.')->group(function () {
        Route::get('/', [LpaController::class, 'index'])->name('index');
        Route::get('/create', [LpaController::class, 'create'])->name('create');
        Route::post('/', [LpaController::class, 'store'])->name('store');
        Route::get('/{lpa}', [LpaController::class, 'show'])->name('show');
        Route::delete('/{lpa}', [LpaController::class, 'destroy'])->name('destroy');

        // PDF Operations
        Route::get('/{lpa}/pdf/download', [LpaController::class, 'downloadPdf'])->name('pdf.download');
        Route::get('/{lpa}/pdf/preview', [LpaController::class, 'previewPdf'])->name('pdf.preview');
        Route::post('/{lpa}/pdf/regenerate', [LpaController::class, 'regeneratePdf'])->name('pdf.regenerate');

        // Payment Processing
        Route::post('/{lpa}/payment', [LpaController::class, 'processPayment'])->name('payment');
    });

    // Will Routes
    Route::prefix('wills')->name('wills.')->group(function () {
        Route::get('/', [WillController::class, 'index'])->name('index');
        Route::post('/', [WillController::class, 'store'])->name('store');
        Route::post('/save-draft', [WillController::class, 'saveDraft'])->name('save-draft');
        Route::get('/{will}', [WillController::class, 'show'])->name('show');
        Route::delete('/{will}', [WillController::class, 'destroy'])->name('destroy');
    });

    // Profile Routes
    Route::get('/profile', [UserProfileController::class, 'edit'])->name('user-profile.edit');
    Route::post('/profile', [UserProfileController::class, 'update'])->name('user-profile.update');
});

// Twilio Webhook - no auth, no CSRF
Route::post('/twilio/webhook', [TwilioController::class, 'webhook'])->name('twilio.webhook');
