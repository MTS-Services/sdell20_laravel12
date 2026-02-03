<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('frontend/home');
    }

    public function horizonWills(): Response
    {
        return Inertia::render('frontend/horizon-wills');
    }

    public function contact(): Response
    {
        return Inertia::render('frontend/contact');
    }

    public function willWriting(): Response
    {
        return Inertia::render('frontend/will-writing');
    }

    public function lpa(): Response
    {
        return Inertia::render('frontend/lpa');
    }

    public function probate(): Response
    {
        return Inertia::render('frontend/probate');
    }
}
