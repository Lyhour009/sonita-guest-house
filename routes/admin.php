<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\InvoiceController;
use App\Http\Controllers\Admin\RoomController;
use App\Http\Controllers\Admin\RoomImageController;
use App\Http\Controllers\Admin\ServiceController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\StaffAccountController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');

    Route::resource('rooms', RoomController::class)->except(['show', 'create', 'edit']);

    Route::post('rooms/{room}/images', [RoomImageController::class, 'store'])->name('rooms.images.store');
    Route::delete('rooms/{room}/images/{roomImage}', [RoomImageController::class, 'destroy'])->name('rooms.images.destroy');

    Route::get('invoices', [InvoiceController::class, 'index'])->name('invoices.index');
    Route::post('invoices', [InvoiceController::class, 'store'])->name('invoices.store');
    Route::get('invoices/{invoice}/pdf', [InvoiceController::class, 'download'])->name('invoices.pdf');

    Route::get('settings', [SettingController::class, 'edit'])->name('settings.edit');
    Route::patch('settings', [SettingController::class, 'update'])->name('settings.update');

    Route::resource('services', ServiceController::class)->except(['show', 'create', 'edit']);

    Route::resource('staff', StaffAccountController::class)->except(['show', 'create', 'edit', 'destroy']);
});
