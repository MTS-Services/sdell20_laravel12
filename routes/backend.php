<?php

use App\Http\Controllers\Backend\Admin\AdminDashboardController;
use App\Http\Controllers\Backend\User\UserDashboardController;
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
    
    // Admin Routes
    Route::middleware(['admin'])->prefix('admin')->name('admin.')->group(function () {
        Route::get('/dashboard', AdminDashboardController::class)->name('dashboard');
        Route::get('/users/list', [UserSelectionController::class, 'getUsers'])->name('users.list');
    });

    // Profile Routes
    Route::get('/profile', [UserProfileController::class, 'edit'])->name('user-profile.edit');
    Route::post('/profile', [UserProfileController::class, 'update'])->name('user-profile.update');
});