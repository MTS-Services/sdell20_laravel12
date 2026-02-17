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
        return Inertia::render('frontend/will-writing-online');
    }

    public function contact(): Response
    {
        return Inertia::render('frontend/contact');
    }

    public function willWriting(): Response
    {
        return Inertia::render('frontend/will-writing');
    }

    public function willWritingStart(): Response
    {
        return Inertia::render('frontend/will-writing-start');
    }

    public function lpa(): Response
    {
        return Inertia::render('frontend/lpa');
    }

    public function lpaStart(): Response
    {
        return Inertia::render('frontend/lpa-start');
    }

    public function probate(): Response
    {
        return Inertia::render('frontend/probate');
    }

    public function privacyPolicy(): Response
    {
        return Inertia::render('frontend/privacy-policy');
    }

    public function terms(): Response
    {
        return Inertia::render('frontend/terms-and-conditions');
    }

    public function consumerRights(): Response
    {
        return Inertia::render('frontend/consumer-rights-act');
    }

    public function cookiePolicy(): Response
    {
        return Inertia::render('frontend/cookie-policy');
    }
}
