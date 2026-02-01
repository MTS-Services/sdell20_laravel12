<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class FrontendController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('frontend/home');
    }

    public function horizonWills(): \Inertia\Response
    {
        return Inertia::render('frontend/horizon-wills');
    }
}
