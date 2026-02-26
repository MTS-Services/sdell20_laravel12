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
        Schema::create('lpas', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Basic LPA Information
            $table->enum('who_for', ['Me', 'Mirror'])->default('Me');
            $table->enum('document_type', ['property', 'health'])->nullable();
            $table->enum('status', ['draft', 'pending_payment', 'completed'])->default('draft');
            
            // Donor Details
            $table->json('donor_details')->nullable();
            $table->json('contact_details')->nullable();
            
            // Attorneys
            $table->json('attorneys')->nullable();
            $table->boolean('can_view_documents')->nullable();
            
            // Replacement Attorneys
            $table->json('replacement_attorneys')->nullable();
            $table->boolean('want_replacement_attorneys')->nullable();
            
            // Additional Decisions
            $table->boolean('life_sustaining_treatment')->nullable();
            $table->boolean('notify_people')->nullable();
            
            // Application Information
            $table->string('applicant')->nullable();
            $table->string('document_recipient')->nullable();
            $table->boolean('certificate_choice')->nullable();
            
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
        Schema::dropIfExists('lpas');
    }
};
