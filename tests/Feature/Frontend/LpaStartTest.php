<?php

it('renders the LPA start Inertia page', function () {
    $response = $this->get(route('lpa.start'));

    $response->assertOk();

    $response->assertInertia(fn ($page) => $page
        ->component('frontend/lpa-start')
        ->url('/lpa/start')
    );
});

