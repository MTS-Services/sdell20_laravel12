<?php

use App\Http\Controllers\Frontend\FrontendController;
use Illuminate\Support\Facades\Route;

Route::get("/", [FrontendController::class, "index"])->name("home");
Route::get("/horizon-wills", [FrontendController::class, "horizonWills"])->name("horizon-wills");
Route::get("/contact", [FrontendController::class, "contact"])->name("contact");
Route::get("/will-writing", [FrontendController::class, "willWriting"])->name("will-writing");
Route::get("/will-writing/start", [FrontendController::class, "willWritingStart"])->name("will-writing.start");
Route::get("/lpa", [FrontendController::class, "lpa"])->name("lpa");
Route::get("/lpa/start", [FrontendController::class, "lpaStart"])->name("lpa.start");
Route::get("/probate", [FrontendController::class, "probate"])->name("probate");