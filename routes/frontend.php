<?php

use App\Http\Controllers\Frontend\FrontendController;
use Illuminate\Support\Facades\Route;

Route::get("/", [FrontendController::class, "index"])->name("home");
Route::get("/horizon-wills", [FrontendController::class, "horizonWills"])->name("horizon-wills");
Route::get("/contact", [FrontendController::class, "contact"])->name("contact");