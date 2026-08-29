<?php

namespace Database\Seeders;

use App\Actions\Invoices\GenerateLongStayInvoice;
use App\Actions\Payments\ConfirmPayment;
use App\Actions\Payments\SubmitPayment;
use App\Actions\Reservations\CheckInReservation;
use App\Actions\Reservations\CheckOutReservation;
use App\Actions\Reservations\ConfirmReservation;
use App\Actions\Reservations\CreateGuestReservation;
use App\Actions\Reviews\CreateReview;
use App\Models\PromoCode;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class ReservationSeeder extends Seeder
{
    public function run(): void
    {
        $createGuestReservation = app(CreateGuestReservation::class);
        $confirmReservation = app(ConfirmReservation::class);
        $checkInReservation = app(CheckInReservation::class);
        $checkOutReservation = app(CheckOutReservation::class);
        $submitPayment = app(SubmitPayment::class);
        $confirmPayment = app(ConfirmPayment::class);
        $generateLongStayInvoice = app(GenerateLongStayInvoice::class);
        $createReview = app(CreateReview::class);

        $promoCodes = PromoCode::pluck('code')->all();
        $paymentMethods = ['cash', 'bank_transfer', 'qr'];
        $reviewComments = [
            'Very clean room and friendly staff, would stay again!',
            'Great location in Phnom Penh and comfortable bed.',
            'Good value for the price, AC worked well.',
            'Quiet stay, smooth check-in process.',
            null,
        ];

        $firstNames = ['Sokha', 'Chea', 'Sovann', 'Bopha', 'Nita', 'Dara', 'Panha', 'Vibol', 'Sophea', 'Chann', 'Rithy', 'Vanny'];
        $lastNames = ['Seng', 'Chhun', 'Sok', 'Pen', 'Keo', 'Meas', 'Ros', 'Chhan', 'Prak', 'Kong', 'Heng', 'Cheam'];

        $rooms = Room::all();
        if ($rooms->isEmpty()) {
            return;
        }

        $guests = [];
        for ($i = 0; $i < 20; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $fullName = $lastName.' '.$firstName;
            $email = strtolower(Str::ascii($firstName)).$i.'@example.com';

            $guests[] = User::create([
                'full_name' => $fullName,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'guest',
                'phone_number' => '0'.rand(12, 99).rand(100000, 999999),
            ]);
        }

        $guaranteedPaidInvoiceDone = false;
        $guaranteedLongStayInvoiceDone = false;

        for ($i = 0; $i < 35; $i++) {
            $guest = $guests[array_rand($guests)];
            $room = $rooms->random();

            $daysAgo = rand(0, 30);
            $duration = rand(1, 4);

            $checkInDate = now()->subDays($daysAgo);
            $checkOutDate = (clone $checkInDate)->addDays($duration);

            $type = ($room->rental_mode === 'both')
              ? (rand(1, 10) > 7 ? 'long_stay' : 'short_stay')
              : $room->rental_mode;

            if ($type === 'long_stay') {
                $durationMonths = rand(1, 3);
                $checkOutDate = (clone $checkInDate)->addMonths($durationMonths);

                $data = [
                    'room_id' => $room->id,
                    'reservation_type' => 'long_stay',
                    'start_date' => $checkInDate->toDateString(),
                    'end_date' => (rand(1, 10) > 5) ? $checkOutDate->toDateString() : null,
                    'monthly_due_day' => $checkInDate->day <= 28 ? $checkInDate->day : 1,
                ];
            } else {
                $data = [
                    'room_id' => $room->id,
                    'reservation_type' => 'short_stay',
                    'check_in_date' => $checkInDate->toDateString(),
                    'check_out_date' => $checkOutDate->toDateString(),
                    'num_guests' => rand(1, $room->max_occupants),
                ];
            }

            if ($promoCodes !== [] && rand(1, 100) <= 20) {
                $data['promo_code'] = $promoCodes[array_rand($promoCodes)];
            }

            try {
                $reservation = $createGuestReservation->handle($guest, $data);
                $confirmReservation->handle($reservation);

                if ($type === 'short_stay' && $checkInDate->isPast()) {
                    $checkInReservation->handle($reservation);

                    if ($checkOutDate->isPast()) {
                        $checkOutReservation->handle($reservation);
                        $room->update(['status' => 'available']);

                        $invoice = $reservation->invoices()->latest()->first();

                        if ($invoice) {
                            $roll = rand(1, 100);

                            if (! $guaranteedPaidInvoiceDone || $roll <= 60) {
                                $payment = $submitPayment->handle($guest, $invoice, [
                                    'amount' => $invoice->total_amount,
                                    'method' => $paymentMethods[array_rand($paymentMethods)],
                                ]);
                                $confirmPayment->handle($payment);
                                $guaranteedPaidInvoiceDone = true;
                            } elseif ($roll <= 80) {
                                $submitPayment->handle($guest, $invoice, [
                                    'amount' => $invoice->total_amount,
                                    'method' => $paymentMethods[array_rand($paymentMethods)],
                                ]);
                            }

                            if (rand(1, 100) <= 60) {
                                $createReview->handle($reservation, $guest, rand(3, 5), $reviewComments[array_rand($reviewComments)]);
                            }
                        }
                    }
                }

                if ($type === 'long_stay' && $reservation->status === 'active') {
                    if (! $guaranteedLongStayInvoiceDone || rand(1, 100) <= 70) {
                        $elecStart = rand(1000, 3000);
                        $waterStart = rand(100, 300);

                        $longStayInvoice = $generateLongStayInvoice->handle($reservation, [
                            'billing_period' => now()->startOfMonth()->toDateString(),
                            'elec_meter_start' => $elecStart,
                            'elec_meter_end' => $elecStart + rand(80, 200),
                            'water_meter_start' => $waterStart,
                            'water_meter_end' => $waterStart + rand(5, 25),
                        ]);

                        if ($guaranteedLongStayInvoiceDone && rand(1, 100) <= 50) {
                            $payment = $submitPayment->handle($guest, $longStayInvoice, [
                                'amount' => $longStayInvoice->total_amount,
                                'method' => $paymentMethods[array_rand($paymentMethods)],
                            ]);
                            $confirmPayment->handle($payment);
                        }

                        $guaranteedLongStayInvoiceDone = true;
                    }
                }
            } catch (\Exception $e) {
                continue;
            }
        }
    }
}
