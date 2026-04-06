<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Mail\ContactClaraMail;
use App\Services\BlogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;

class FrontendController extends Controller
{

    protected BlogService $blogService;

    public function __construct(BlogService $blogService)
    {
        $this->blogService = $blogService;
    }

    public function index(): Response
    {
        return Inertia::render('frontend/home');
    }

    public function horizonWills(): Response
    {
        return Inertia::render('frontend/investment-opportunity');
    }

    public function contact(): Response
    {
        return Inertia::render('frontend/contact');
    }

    public function submitContact(Request $Request)
    {
        $validated = $Request->validate([
            'firstName' => 'required|string|max:255',
            'lastName' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'message' => 'nullable|string|max:1000',
        ]);

        // Send email to Clara
        Mail::to('clara.martinez@onlinewillwrite.online')
            ->cc(['team@willwrite.online', 'dellysean39@gmail.com'])
            ->send(new ContactClaraMail($validated));

        return back()->with('success', 'Message sent successfully!');
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

    public function blog(): Response
    {
        $blogData = $this->blogService->getBlogsByCategory(12);

        return Inertia::render('frontend/blog', [
            'blogData' => $blogData,
        ]);
    }

    public function blogCategory(string $category, int $page = 1): Response
    {
        $blogData = $this->blogService->getBlogsByCategory(12, $page, $category);

        return Inertia::render('frontend/blog', [
            'blogData' => $blogData,
        ]);
    }
    public function blogDetails(string $slug): Response
    {
        $blog = $this->blogService->getBlogBySlug($slug);
        $recentBlogsFromSameCategory = $this->blogService->getRecentBlogsFromSameCategory($blog, 4);

        return Inertia::render('frontend/blog-details', [
            'blog' => $blog,
            'recentBlogsFromSameCategory' => $recentBlogsFromSameCategory,
        ]);
    }
}
