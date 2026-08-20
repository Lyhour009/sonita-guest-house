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
        Schema::create('rooms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('room_number')->unique();
            $table->string('room_type');
            $table->enum('rental_mode', ['short_stay', 'long_stay', 'both'])->default('both');
            $table->decimal('price_per_night', 10, 2);
            $table->decimal('price_per_month', 10, 2);
            $table->enum('status', ['available', 'occupied', 'reserved', 'cleaning', 'maintenance'])->default('available');
            $table->integer('floor')->nullable();
            $table->integer('max_occupants')->default(1);
            $table->text('amenities')->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
