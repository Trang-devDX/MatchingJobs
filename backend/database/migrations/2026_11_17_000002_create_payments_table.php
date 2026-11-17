<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('company_id')->index()->constrained(table: 'companies');
            $table->foreignUuid('staff_id')->index()->constrained(table: 'staffs');
            $table->string('stripe_checkout_session_id')->nullable()->unique();
            $table->string('stripe_payment_intent_id')->nullable();
            $table->string('stripe_event_id')->nullable()->unique();
            $table->unsignedInteger('amount')->nullable();
            $table->string('currency', 3)->default('usd');
            $table->unsignedInteger('credits')->default(1);
            $table->smallInteger('status')->default(1)->comment('1: Pending, 2: Paid, 3: Expired, 9: Failed');
            $table->timestamp('paid_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
