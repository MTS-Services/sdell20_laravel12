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
        Schema::create('wills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');

            // Basic Will Information
            $table->enum('will_type', ['Me', 'Mirror'])->default('Me');
            $table->enum('status', ['draft', 'pending_payment', 'completed'])->default('draft');

            // Personal Information
            $table->json('personal_info')->nullable();
            $table->json('spouse')->nullable();

            // Executors
            $table->json('executors')->nullable();
            $table->json('alternate_executors')->nullable();

            // Children & Guardians
            $table->json('children')->nullable();
            $table->json('guardians')->nullable();

            // Beneficiaries & Gifts
            $table->json('beneficiaries')->nullable();
            $table->json('specific_gifts')->nullable();
            $table->json('total_failure_beneficiaries')->nullable();

            // Additional Details
            $table->json('pets')->nullable();
            $table->json('additional_clauses')->nullable();
            $table->json('form_data')->nullable();

            // Signing Information
            $table->string('signing_timeline')->nullable();
            $table->date('signing_date')->nullable();
            $table->string('signing_city')->nullable();
            $table->string('signing_country')->nullable();

            // PDF Generation
            $table->string('pdf_path')->nullable();
            $table->timestamp('pdf_generated_at')->nullable();
            $table->boolean('is_draft')->default(true);

            // Payment
            $table->decimal('amount', 10, 2)->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('payment_reference')->nullable();

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('wills');
    }
};
