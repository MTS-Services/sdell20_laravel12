<?php

it('redirects legacy /lpa URLs to power-of-attorney-online', function () {
    $this->get('/lpa')->assertRedirect('/power-of-attorney-online');
    $this->get('/lpa/start')->assertRedirect('/power-of-attorney-online/start');
});

it('renders the LPA start Inertia page', function () {
    $response = $this->get(route('lpa.start'));

    $response->assertOk();

    $response->assertInertia(
        fn($page) => $page
            ->component('frontend/lpa-start')
            ->url('/power-of-attorney-online/start')
    );
});
