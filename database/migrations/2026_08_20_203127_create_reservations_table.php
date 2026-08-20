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
        Schema::create('reservations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('guest_id')->constrained('users');
            $table->foreignUuid('room_id')->constrained('rooms');
            $table->enum('reservation_type', ['short_stay', 'long_stay']);
            $table->date('check_in_date')->nullable();
            $table->date('check_out_date')->nullable();
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->decimal('deposit_amount', 10, 2)->nullable();
            $table->integer('monthly_due_day')->nullable();
            $table->integer('num_guests')->nullable();
            $table->enum('status', [
                'pending', 'confirmed', 'checked_in', 'checked_out', 'active', 'expired', 'cancelled', 'terminated',
            ]);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
