<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE lpas MODIFY document_type ENUM('property', 'health', 'both') NULL");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'mysql') {
            DB::statement("UPDATE lpas SET document_type = 'property' WHERE document_type = 'both'");
            DB::statement("ALTER TABLE lpas MODIFY document_type ENUM('property', 'health') NULL");
        }
    }
};
