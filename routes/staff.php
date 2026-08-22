<?php

use App\Http\Controllers\Staff\HousekeepingController;
use App\Http\Controllers\Staff\MaintenanceRequestController;
use App\Http\Controllers\Staff\PaymentController;
use App\Http\Controllers\Staff\ReservationController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'role:receptionist,admin'])->prefix('staff')->name('staff.')->group(function () {
    Route::get('reservations', [ReservationController::class, 'index'])->name('reservations.index');
    Route::post('reservations', [ReservationController::class, 'store'])->name('reservations.store');
    Route::patch('reservations/{reservation}/confirm', [ReservationController::class, 'confirm'])->name('reservations.confirm');
    Route::patch('reservations/{reservation}/check-in', [ReservationController::class, 'checkIn'])->name('reservations.check-in');
    Route::patch('reservations/{reservation}/check-out', [ReservationController::class, 'checkOut'])->name('reservations.check-out');
    Route::patch('reservations/{reservation}/cancel', [ReservationController::class, 'cancel'])->name('reservations.cancel');
    Route::post('reservations/{reservation}/services', [\App\Http\Controllers\Staff\ReservationServiceController::class, 'store'])->name('reservations.services.store');
    Route::delete('reservations/{reservation}/services/{service}', [\App\Http\Controllers\Staff\ReservationServiceController::class, 'destroy'])->name('reservations.services.destroy');

    Route::get('payments', [PaymentController::class, 'index'])->name('payments.index');
    Route::patch('payments/{payment}/confirm', [PaymentController::class, 'confirm'])->name('payments.confirm');
    Route::patch('payments/{payment}/reject', [PaymentController::class, 'reject'])->name('payments.reject');
});

Route::middleware(['auth', 'role:housekeeping,admin'])->prefix('staff')->name('staff.')->group(function () {
    Route::get('housekeeping', [HousekeepingController::class, 'index'])->name('housekeeping.index');
    Route::patch('housekeeping/{room}/clean', [HousekeepingController::class, 'markClean'])->name('housekeeping.clean');

    Route::get('maintenance', [MaintenanceRequestController::class, 'index'])->name('maintenance.index');
    Route::patch('maintenance/{maintenanceRequest}/assign', [MaintenanceRequestController::class, 'assign'])->middleware('role:admin')->name('maintenance.assign');
    Route::patch('maintenance/{maintenanceRequest}/status', [MaintenanceRequestController::class, 'updateStatus'])->name('maintenance.status');
});
