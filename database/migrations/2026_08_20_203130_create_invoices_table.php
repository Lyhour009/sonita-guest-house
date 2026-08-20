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
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('reservation_id')->constrained();
            $table->enum('invoice_type', ['short_stay', 'long_stay']);
            $table->date('billing_period')->nullable();
            $table->decimal('room_charge', 10, 2);
            $table->decimal('service_charge', 10, 2)->default(0);
            $table->decimal('utility_charge', 10, 2)->nullable();
            $table->decimal('elec_meter_start', 10, 2)->nullable();
            $table->decimal('elec_meter_end', 10, 2)->nullable();
            $table->decimal('water_meter_start', 10, 2)->nullable();
            $table->decimal('water_meter_end', 10, 2)->nullable();
            $table->decimal('tax_amount', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->enum('status', ['unpaid', 'partial', 'paid'])->default('unpaid');
            $table->date('due_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
