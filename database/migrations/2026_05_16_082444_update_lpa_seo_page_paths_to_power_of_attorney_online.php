<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('seo_pages')
            ->where('route_name', 'lpa')
            ->update(['path' => '/power-of-attorney-online']);

        DB::table('seo_pages')
            ->where('route_name', 'lpa.start')
            ->update(['path' => '/power-of-attorney-online/start']);
    }

    public function down(): void
    {
        DB::table('seo_pages')
            ->where('route_name', 'lpa')
            ->update(['path' => '/lpa']);

        DB::table('seo_pages')
            ->where('route_name', 'lpa.start')
            ->update(['path' => '/lpa/start']);
    }
};
