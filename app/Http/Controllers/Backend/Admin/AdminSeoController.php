<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Models\SeoPage;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminSeoController extends Controller
{
    /**
     * Simple list of public pages to manage SEO for.
     * Route names come from routes/frontend.php
     */
    private function defaultPages(): array
    {
        return [
            ['route_name' => 'home', 'page_name' => 'Home', 'path' => '/'],
            ['route_name' => 'investment-opportunity', 'page_name' => 'Investment Opportunity', 'path' => '/investment-opportunity'],
            ['route_name' => 'contact', 'page_name' => 'Contact', 'path' => '/contact'],
            ['route_name' => 'will-writing', 'page_name' => 'Will Writing', 'path' => '/will-writing'],
            ['route_name' => 'will-writing.start', 'page_name' => 'Will Writing Start', 'path' => '/will-writing/start'],
            ['route_name' => 'lpa', 'page_name' => 'LPA', 'path' => '/lpa'],
            ['route_name' => 'lpa.start', 'page_name' => 'LPA Start', 'path' => '/lpa/start'],
            ['route_name' => 'probate', 'page_name' => 'Probate', 'path' => '/probate'],
            ['route_name' => 'privacy', 'page_name' => 'Privacy Policy', 'path' => '/privacy-policy'],
            ['route_name' => 'terms', 'page_name' => 'Terms & Conditions', 'path' => '/terms-and-conditions'],
            ['route_name' => 'consumer-rights', 'page_name' => 'Consumer Rights Act', 'path' => '/consumer-rights-act-2015'],
            ['route_name' => 'cookies', 'page_name' => 'Cookie Policy', 'path' => '/cookie-policy'],
            ['route_name' => 'blog', 'page_name' => 'Blog', 'path' => '/blog'],
            ['route_name' => 'blog.category', 'page_name' => 'Blog Category (template)', 'path' => '/blog/category/{category}'],
            ['route_name' => 'blog.detail', 'page_name' => 'Blog Details (template)', 'path' => '/blog-details/{slug}'],
        ];
    }

    public function index(): Response
    {
        foreach ($this->defaultPages() as $page) {
            SeoPage::firstOrCreate(
                ['route_name' => $page['route_name']],
                [
                    'page_name' => $page['page_name'],
                    'path' => $page['path'] ?? null,
                ]
            );
        }

        $pages = SeoPage::query()
            ->orderBy('page_name')
            ->get(['id', 'route_name', 'page_name', 'path', 'meta_title', 'meta_description', 'meta_keywords']);

        return Inertia::render('backend/Admin/Seo/Index', [
            'pages' => $pages,
        ]);
    }

    public function edit(SeoPage $seoPage): Response
    {
        return Inertia::render('backend/Admin/Seo/Edit', [
            'page' => $seoPage->only(['id', 'route_name', 'page_name', 'path', 'meta_title', 'meta_description', 'meta_keywords']),
        ]);
    }

    public function update(Request $request, SeoPage $seoPage): RedirectResponse
    {
        $validated = $request->validate([
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'meta_keywords' => 'nullable|string|max:1000',
        ]);

        $seoPage->update($validated);

        return redirect()
            ->route('admin.seo.index')
            ->with('success', 'SEO meta updated successfully!');
    }
}

