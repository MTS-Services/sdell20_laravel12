<?php

namespace Database\Seeders;

use App\Models\SeoPage;
use Illuminate\Database\Seeder;

class SeoPagesSeeder extends Seeder
{
    public function run(): void
    {
        $pages = [
            ['route_name' => 'home', 'page_name' => 'Home', 'path' => '/'],
            ['route_name' => 'investment-opportunity', 'page_name' => 'Investment Opportunity', 'path' => '/investment-opportunity'],
            ['route_name' => 'contact', 'page_name' => 'Contact', 'path' => '/contact'],
            ['route_name' => 'will-writing', 'page_name' => 'Will Writing', 'path' => '/will-writing'],
            ['route_name' => 'will-writing.start', 'page_name' => 'Will Writing Start', 'path' => '/will-writing/start'],
            ['route_name' => 'lpa', 'page_name' => 'LPA', 'path' => '/power-of-attorney-online'],
            ['route_name' => 'lpa.start', 'page_name' => 'LPA Start', 'path' => '/power-of-attorney-online/start'],
            ['route_name' => 'probate', 'page_name' => 'Probate', 'path' => '/probate'],
            ['route_name' => 'privacy', 'page_name' => 'Privacy Policy', 'path' => '/privacy-policy'],
            ['route_name' => 'terms', 'page_name' => 'Terms & Conditions', 'path' => '/terms-and-conditions'],
            ['route_name' => 'consumer-rights', 'page_name' => 'Consumer Rights Act', 'path' => '/consumer-rights-act-2015'],
            ['route_name' => 'cookies', 'page_name' => 'Cookie Policy', 'path' => '/cookie-policy'],
            ['route_name' => 'blog', 'page_name' => 'Blog', 'path' => '/blog'],
            ['route_name' => 'blog.category', 'page_name' => 'Blog Category (template)', 'path' => '/blog/category/{category}'],
            ['route_name' => 'blog.category.page', 'page_name' => 'Blog Category Pagination (template)', 'path' => '/blog/category/{category}/page/{page}'],
            ['route_name' => 'blog.detail', 'page_name' => 'Blog Details (template)', 'path' => '/blog-details/{slug}'],
        ];

        foreach ($pages as $page) {
            SeoPage::updateOrCreate(
                ['route_name' => $page['route_name']],
                [
                    'page_name' => $page['page_name'],
                    'path' => $page['path'],
                ]
            );
        }
    }
}
