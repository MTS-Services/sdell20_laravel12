<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Support\Facades\Vite;

abstract class TestCase extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        Vite::useBuildDirectory('build');
        Vite::useManifestFilename('manifest.json');
        
        if (! file_exists(public_path('build/manifest.json'))) {
            Vite::withoutScripts();
            Vite::withoutStylesheets();
        }
    }
}
