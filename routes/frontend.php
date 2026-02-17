<?php

use App\Http\Controllers\Frontend\FrontendController;
use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get("/", [FrontendController::class, "index"])->name("home");
    Route::get("/will-writing-online", [FrontendController::class, "horizonWills"])->name("will-writing-online");
    Route::get("/contact", [FrontendController::class, "contact"])->name("contact");
    Route::get("/will-writing", [FrontendController::class, "willWriting"])->name("will-writing");
    Route::get("/will-writing/start", [FrontendController::class, "willWritingStart"])->name("will-writing.start");
    Route::get("/lpa", [FrontendController::class, "lpa"])->name("lpa");
    Route::get("/lpa/start", [FrontendController::class, "lpaStart"])->name("lpa.start");
    Route::get("/probate", [FrontendController::class, "probate"])->name("probate");
    Route::get("/privacy-policy", [FrontendController::class, "privacyPolicy"])->name("privacy");
    Route::get("/terms-and-conditions", [FrontendController::class, "terms"])->name("terms");
    Route::get("/consumer-rights-act-2015", [FrontendController::class, "consumerRights"])->name("consumer-rights");
    Route::get("/cookie-policy", [FrontendController::class, "cookiePolicy"])->name("cookies");
});