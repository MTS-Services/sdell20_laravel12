<?php

it('keeps the LPA landing hero title as agreed with the client', function (): void {
    $path = resource_path('js/components/frontend/lpa/lpa-start-application-section.tsx');

    expect(file_exists($path))->toBeTrue();
    expect(file_get_contents($path))->toContain('Power of Attorney Online');
});

it('uses dark blue branding on the LPA multi-step start flow', function (): void {
    $path = resource_path('js/pages/frontend/lpa-start.tsx');

    expect(file_get_contents($path))->toContain('bg-primary-700');
    expect(file_get_contents($path))->not->toContain('bg-primary-50 px-3 py-10');
});

it('uses powerofattorneyonline.co.uk CTA button colors on LPA components', function (): void {
    $ctaPath = resource_path('js/components/frontend/lpa/lpa-start-application-section.tsx');

    expect(file_get_contents($ctaPath))->toContain('brandCtaClasses');
    expect(file_get_contents($ctaPath))->not->toContain('bg-blue-600');
});

it('keeps the Will writing hero titles as agreed with the client', function (): void {
    $bannerPath = resource_path('js/components/frontend/home/banner.tsx');
    $heroPath = resource_path('js/components/frontend/will-writing/will-writing-hero-section.tsx');

    expect(file_get_contents($bannerPath))->toContain('Make a Will Online');
    expect(file_get_contents($heroPath))->toContain('Make a Will Online');
});

it('serves the LPA and Will writing marketing pages', function (): void {
    $this->get(route('lpa'))->assertOk()->assertInertia(fn($page) => $page
        ->component('frontend/lpa'));

    $this->get(route('will-writing'))->assertOk()->assertInertia(fn($page) => $page
        ->component('frontend/will-writing'));
});
