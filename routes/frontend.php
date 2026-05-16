<?php

use App\Http\Controllers\Frontend\FrontendController;
use Illuminate\Support\Facades\Route;

Route::get('/', [FrontendController::class, 'index'])->name('home');
Route::get('/investment-opportunity', [FrontendController::class, 'horizonWills'])->name('investment-opportunity');
Route::get('/contact', [FrontendController::class, 'contact'])->name('contact');
Route::post('/contact/submit', [FrontendController::class, 'submitContact'])->name('contact.submit');
Route::get('/will-writing', [FrontendController::class, 'willWriting'])->name('will-writing');
Route::get('/will-writing/start', [FrontendController::class, 'willWritingStart'])->name('will-writing.start');
Route::redirect('/lpa', '/power-of-attorney-online', 301);
Route::redirect('/lpa/start', '/power-of-attorney-online/start', 301);
Route::get('/power-of-attorney-online', [FrontendController::class, 'lpa'])->name('lpa');
Route::get('/power-of-attorney-online/start', [FrontendController::class, 'lpaStart'])->name('lpa.start');
Route::get('/probate', [FrontendController::class, 'probate'])->name('probate');
Route::get('/privacy-policy', [FrontendController::class, 'privacyPolicy'])->name('privacy');
Route::get('/terms-and-conditions', [FrontendController::class, 'terms'])->name('terms');
Route::get('/consumer-rights-act-2015', [FrontendController::class, 'consumerRights'])->name('consumer-rights');
Route::get('/cookie-policy', [FrontendController::class, 'cookiePolicy'])->name('cookies');
Route::get('/blog', [FrontendController::class, 'blog'])->name('blog');
Route::get('/blog/category/{category}', [FrontendController::class, 'blogCategory'])->name('blog.category');
Route::get('/blog/category/{category}/page/{page}', [FrontendController::class, 'blogCategory'])->name('blog.category.page');
Route::get('/blog-details/{slug}', [FrontendController::class, 'blogDetails'])->name('blog.detail');
