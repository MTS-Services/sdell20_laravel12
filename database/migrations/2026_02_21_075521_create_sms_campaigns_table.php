<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sms_campaigns', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_id')->constrained('users')->cascadeOnDelete();
            $table->string('name')->nullable();
            $table->text('message');
            $table->string('sender_id')->nullable();
            $table->enum('schedule_type', ['one_time', 'daily']);
            $table->timestamp('scheduled_at')->nullable(); // for one-time
            $table->string('daily_time', 5)->nullable(); // HH:MM for daily recurring
            $table->string('timezone', 64)->default('Asia/Dhaka');
            $table->enum('status', ['draft', 'scheduled', 'running', 'completed', 'paused', 'failed'])->default('draft');
            $table->unsignedInteger('total_numbers')->default(0);
            $table->unsignedInteger('sent_count')->default(0);
            $table->unsignedInteger('failed_count')->default(0);
            $table->unsignedInteger('pending_count')->default(0);
            $table->string('csv_filename')->nullable();
            $table->timestamp('last_run_at')->nullable();
            $table->timestamp('next_run_at')->nullable();
            $table->boolean('is_enabled')->default(true);
            $table->timestamps();

            $table->index(['status', 'next_run_at']);
            $table->index('admin_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms_campaigns');
    }
};
