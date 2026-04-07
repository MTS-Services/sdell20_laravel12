<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Mail\ContactClaraMail;
use App\Services\BlogService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Inertia\Response;
use App\Services\GoogleReviewService;

class FrontendController extends Controller
{

    protected BlogService $blogService;
    protected GoogleReviewService $googleReviewService;
    public function __construct(BlogService $blogService, GoogleReviewService $googleReviewService)
    {
        $this->blogService = $blogService;
        $this->googleReviewService = $googleReviewService;
    }

    private function withGoogleReviews(array $props = []): array
    {
        $placeId = (string) config('services.google.place_id');
        $googleWriteReviewUrl = $placeId !== ''
            ? ('https://search.google.com/local/writereview?placeid=' . $placeId)
            : null;

        return array_merge([
            'reviews' => $this->googleReviewService->getReviews(),
            'googleWriteReviewUrl' => $googleWriteReviewUrl,
        ], $props);
    }

    public function index(): Response
    {
        return Inertia::render('frontend/home', $this->withGoogleReviews());
    }

    public function horizonWills(): Response
    {
        return Inertia::render('frontend/investment-opportunity', $this->withGoogleReviews());
    }

    public function contact(): Response
    {
        return Inertia::render('frontend/contact', $this->withGoogleReviews());
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
        return Inertia::render('frontend/will-writing', $this->withGoogleReviews());
    }

    public function willWritingStart(): Response
    {
        return Inertia::render('frontend/will-writing-start', $this->withGoogleReviews());
    }

    public function lpa(): Response
    {
        return Inertia::render('frontend/lpa', $this->withGoogleReviews());
    }

    public function lpaStart(): Response
    {
        return Inertia::render('frontend/lpa-start', $this->withGoogleReviews());
    }

    public function probate(): Response
    {
        return Inertia::render('frontend/probate', $this->withGoogleReviews());
    }

    public function privacyPolicy(): Response
    {
        return Inertia::render('frontend/privacy-policy', $this->withGoogleReviews());
    }

    public function terms(): Response
    {
        return Inertia::render('frontend/terms-and-conditions', $this->withGoogleReviews());
    }

    public function consumerRights(): Response
    {
        return Inertia::render('frontend/consumer-rights-act', $this->withGoogleReviews());
    }

    public function cookiePolicy(): Response
    {
        return Inertia::render('frontend/cookie-policy', $this->withGoogleReviews());
    }

    public function blog(): Response
    {
        $blogData = $this->blogService->getBlogsByCategory(12);

        return Inertia::render('frontend/blog', $this->withGoogleReviews([
            'blogData' => $blogData,
        ]));
    }

    public function blogCategory(string $category, int $page = 1): Response
    {
        $blogData = $this->blogService->getBlogsByCategory(12, $page, $category);

        return Inertia::render('frontend/blog', $this->withGoogleReviews([
            'blogData' => $blogData,
        ]));
    }
    public function blogDetails(string $slug): Response
    {
        $blog = $this->blogService->getBlogBySlug($slug);
        $recentBlogsFromSameCategory = $this->blogService->getRecentBlogsFromSameCategory($blog, 4);

        return Inertia::render('frontend/blog-details', $this->withGoogleReviews([
            'blog' => $blog,
            'recentBlogsFromSameCategory' => $recentBlogsFromSameCategory,
        ]));
    }
}
