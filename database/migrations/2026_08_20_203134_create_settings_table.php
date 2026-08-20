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
        Schema::create('settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('currency')->default('USD');
            $table->decimal('tax_rate', 5, 2)->default(0);
            $table->time('default_checkin_time')->default('14:00');
            $table->time('default_checkout_time')->default('12:00');
            $table->decimal('electric_rate', 10, 2)->default(0);
            $table->decimal('water_rate', 10, 2)->default(0);
            $table->decimal('late_fee', 10, 2)->default(0);
            $table->string('payment_qr_url')->nullable();
            $table->text('payment_instruction')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('settings');
    }
};
