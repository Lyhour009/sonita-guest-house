<?php

use App\Http\Controllers\Admin\RoomController;
use App\Http\Controllers\Admin\RoomImageController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('rooms', RoomController::class)->except(['show', 'create', 'edit']);

    Route::post('rooms/{room}/images', [RoomImageController::class, 'store'])->name('rooms.images.store');
    Route::delete('rooms/{room}/images/{roomImage}', [RoomImageController::class, 'destroy'])->name('rooms.images.destroy');
});
