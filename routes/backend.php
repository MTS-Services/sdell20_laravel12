<?php

use App\Http\Controllers\Backend\Admin\AdminBulkSmsController;
use App\Http\Controllers\Backend\Admin\AdminDashboardController;
use App\Http\Controllers\Backend\Admin\AdminUserController;
use App\Http\Controllers\Backend\User\UserDashboardController;
use App\Http\Controllers\ScheduledSmsController;
use App\Http\Controllers\UserProfileController;
use App\Http\Controllers\UserSelectionController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard Routes
    Route::get('/dashboard', [UserDashboardController::class, 'index'])->name('dashboard');
    Route::get('/dashboard/form', [UserDashboardController::class, 'form'])->name('dashboard.form');
    Route::get('/dashboard/user', [UserDashboardController::class, 'dashboard'])->name('dashboard.user');
    Route::get('/dashboard/lpa/create', [UserDashboardController::class, 'lpaCreate'])->name('dashboard.lpa.create');
    Route::post('/dashboard/complete', [UserDashboardController::class, 'complete'])->name('dashboard.complete');

    // SMS Routes
    Route::get('/sms/scheduled', [ScheduledSmsController::class, 'index'])->name('sms.index');
    Route::get('/sms/create', [ScheduledSmsController::class, 'create'])->name('sms.create');
    Route::post('/sms', [ScheduledSmsController::class, 'store'])->name('sms.store')->middleware('throttle:20,1');
    Route::delete('/sms/{scheduledSms}', [ScheduledSmsController::class, 'destroy'])->name('sms.destroy');

    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('/users/list', [UserSelectionController::class, 'getUsers'])->name('users.list');

        // Bulk SMS Routes
        Route::get('/bulk-sms', [AdminBulkSmsController::class, 'index'])->name('bulk-sms.index');
        Route::get('/bulk-sms/create', [AdminBulkSmsController::class, 'create'])->name('bulk-sms.create');
        Route::post('/bulk-sms', [AdminBulkSmsController::class, 'store'])->name('bulk-sms.store')->middleware('throttle:10,1');
        Route::get('/bulk-sms/{bulkSmsSend}', [AdminBulkSmsController::class, 'show'])->name('bulk-sms.show');
    });

    // Profile Routes
    Route::get('/profile', [UserProfileController::class, 'edit'])->name('user-profile.edit');
    Route::post('/profile', [UserProfileController::class, 'update'])->name('user-profile.update');
});
