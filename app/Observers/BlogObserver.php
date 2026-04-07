<?php

namespace App\Observers;

use App\Models\Blog;
use App\Services\SitemapService;

class BlogObserver
{
    public function saved(Blog $blog): void
    {
        app(SitemapService::class)->generate();
    }

    public function deleted(Blog $blog): void
    {
        app(SitemapService::class)->generate();
    }
}

