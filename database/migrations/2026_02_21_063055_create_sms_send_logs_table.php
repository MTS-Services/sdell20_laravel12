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
        Schema::create('sms_send_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bulk_sms_send_id')->constrained('bulk_sms_sends')->cascadeOnDelete();
            $table->string('phone_number', 20);
            $table->text('message');
            $table->enum('status', ['pending', 'queued', 'sent', 'failed'])->default('pending');
            $table->string('provider_message_id')->nullable();
            $table->text('provider_response')->nullable();
            $table->text('error_reason')->nullable();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('sent_at')->nullable();
            $table->timestamps();

            $table->index(['bulk_sms_send_id', 'status']);
            $table->index('phone_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sms_send_logs');
    }
};
