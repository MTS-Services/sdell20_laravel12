<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Http\Controllers\Controller;
use App\Services\SitemapService;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class AdminSettingsController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('backend/Admin/Settings/Index', [
            'sitemapUrl' => url('/sitemap.xml'),
        ]);
    }

    public function generateSitemap(SitemapService $sitemapService): RedirectResponse
    {
        try {
            $sitemapService->generate();

            return back()->with('success', 'Sitemap generated successfully!');
        } catch (\Throwable $e) {
            report($e);

            return back()->with('error', 'Failed to generate sitemap. Check logs for details.');
        }
    }
}

