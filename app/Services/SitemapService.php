<?php

namespace App\Services;

use App\Models\Blog;
use Carbon\Carbon;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class SitemapService
{
    protected string $sitemapPath;

    public function __construct()
    {
        $this->sitemapPath = public_path('sitemap.xml');
    }

    public function generate(): Sitemap
    {
        $sitemap = Sitemap::create();

        // Static pages
        $sitemap->add(Url::create('/')
            ->setLastModificationDate(Carbon::now())
            ->setChangeFrequency(Url::CHANGE_FREQUENCY_DAILY)
            ->setPriority(1.0));

        $sitemap->add(Url::create('/investment-opportunity'));
        $sitemap->add(Url::create('/contact'));
        $sitemap->add(Url::create('/will-writing'));
        $sitemap->add(Url::create('/will-writing/start'));
        $sitemap->add(Url::create('/power-of-attorney-online'));
        $sitemap->add(Url::create('/power-of-attorney-online/start'));
        $sitemap->add(Url::create('/probate'));
        $sitemap->add(Url::create('/privacy-policy'));
        $sitemap->add(Url::create('/terms-and-conditions'));
        $sitemap->add(Url::create('/consumer-rights-act-2015'));
        $sitemap->add(Url::create('/cookie-policy'));
        $sitemap->add(Url::create('/blog'));

        // Example: Dynamic routes from posts
        $blogs = Blog::where('status', 1)->get();
        foreach ($blogs as $blog) {
            $sitemap->add(Url::create(route('blog.detail', $blog->slug))
                ->setLastModificationDate($blog->updated_at)
                ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                ->setPriority(0.8));
        }
        $sitemap->writeToFile(public_path('sitemap.xml'));

        return $sitemap;
    }

    public function addNew($route, $updated_at): void
    {
        try {
            $sitemap = File::exists($this->sitemapPath)
                ? Sitemap::load($this->sitemapPath)
                : Sitemap::create();

            $sitemap->add(
                Url::create($route)
                    ->setLastModificationDate(Carbon::parse($updated_at))
                    ->setChangeFrequency(Url::CHANGE_FREQUENCY_WEEKLY)
                    ->setPriority(0.8)
            );

            $sitemap->writeToFile($this->sitemapPath);
        } catch (\Exception $e) {
            Log::info('Sitemap Add Error: ' . $e->getMessage());
        }
    }
}
