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
            'Great location and comfortable bed.',
            'Good value for the price, AC worked well.',
            'Quiet and relaxing stay, exactly what we needed.',
            null,
        ];

        $firstNames = ['Sokha', 'Chea', 'Sovann', 'Bopha', 'Nita', 'Dara', 'Panha', 'Vibol', 'Sophea', 'Chann', 'Rithy', 'Vanny', 'Mony', 'Kesor', 'Sok', 'Sao', 'Mao', 'Chan', 'Kim', 'Pich', 'Piseth', 'Sreypich', 'Sreyleak', 'Rathana'];
        $lastNames = ['Seng', 'Chhun', 'Sok', 'Pen', 'Keo', 'Meas', 'Ros', 'Chhan', 'Khieu', 'Nget', 'Prak', 'Kong', 'Men', 'Tep', 'Lim', 'Heng', 'Ouk', 'Cheam', 'Bou'];

        $rooms = Room::all();
        if ($rooms->isEmpty()) {
            $this->command->warn('No rooms found. Skipping reservation seeding.');

            return;
        }

        $guests = [];
        for ($i = 0; $i < 40; $i++) {
            $firstName = $firstNames[array_rand($firstNames)];
            $lastName = $lastNames[array_rand($lastNames)];
            $fullName = $lastName.' '.$firstName;
            $email = strtolower(Str::ascii($firstName)).$i.'@example.com';

            $guests[] = User::create([
                'full_name' => $fullName,
                'email' => $email,
                'password' => Hash::make('password'),
                'role' => 'guest',
                'phone_number' => '0'.rand(1, 9).rand(1000000, 9999999),
            ]);
        }

        // Guarantee at least one paid short-stay invoice and one unpaid long-stay
        // invoice regardless of RNG, per the build spec's demo-readiness requirement.
        $guaranteedPaidInvoiceDone = false;
        $guaranteedLongStayInvoiceDone = false;

        for ($i = 0; $i < 50; $i++) {
            $guest = $guests[array_rand($guests)];
            // Get random available room to avoid conflicts if they are concurrent
            $room = $rooms->random();

            // Generate realistic dates
            $daysAgo = rand(0, 30);
            $duration = rand(1, 5);

            $checkInDate = now()->subDays($daysAgo);
            $checkOutDate = (clone $checkInDate)->addDays($duration);

            $type = ($room->rental_mode === 'both')
                ? (rand(1, 10) > 8 ? 'long_stay' : 'short_stay')
                : $room->rental_mode;

            if ($type === 'long_stay') {
                $durationMonths = rand(1, 6);
                $checkOutDate = (clone $checkInDate)->addMonths($durationMonths);

                $data = [
                    'room_id' => $room->id,
                    'reservation_type' => 'long_stay',
                    'start_date' => $checkInDate->toDateString(),
                    'end_date' => (rand(1, 10) > 5) ? $checkOutDate->toDateString() : null, // some open ended
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
                // If it's in the past and checkout is in the past, it should be checked out
                $reservation = $createGuestReservation->handle($guest, $data);
                $confirmReservation->handle($reservation);

                if ($type === 'short_stay' && $checkInDate->isPast()) {
                    $checkInReservation->handle($reservation);

                    if ($checkOutDate->isPast()) {
                        $checkOutReservation->handle($reservation);
                        // Room is 'cleaning' now, reset to 'available' to allow next bookings
                        $room->update(['status' => 'available']);

                        $invoice = $reservation->invoices()->latest()->first();

                        if ($invoice) {
                            $roll = rand(1, 100);

                            if (! $guaranteedPaidInvoiceDone || $roll <= 55) {
                                $payment = $submitPayment->handle($guest, $invoice, [
                                    'amount' => $invoice->total_amount,
                                    'method' => $paymentMethods[array_rand($paymentMethods)],
                                ]);
                                $confirmPayment->handle($payment);
                                $guaranteedPaidInvoiceDone = true;

                                $rating = rand(3, 5);
                                $createReview->handle($reservation, $guest, $rating, $reviewComments[array_rand($reviewComments)]);
                            } elseif ($roll <= 75) {
                                $payment = $submitPayment->handle($guest, $invoice, [
                                    'amount' => round(((float) $invoice->total_amount) * 0.5, 2),
                                    'method' => $paymentMethods[array_rand($paymentMethods)],
                                ]);
                                $confirmPayment->handle($payment);
                            } elseif ($roll <= 90) {
                                // Left pending, so staff have a real payment to review/confirm.
                                $submitPayment->handle($guest, $invoice, [
                                    'amount' => $invoice->total_amount,
                                    'method' => $paymentMethods[array_rand($paymentMethods)],
                                ]);
                            }
                        }
                    }
                }

                if ($type === 'long_stay' && $reservation->status === 'active') {
                    if (! $guaranteedLongStayInvoiceDone || rand(1, 100) <= 70) {
                        $elecStart = rand(1000, 5000);
                        $waterStart = rand(100, 500);

                        $longStayInvoice = $generateLongStayInvoice->handle($reservation, [
                            'billing_period' => now()->startOfMonth()->toDateString(),
                            'elec_meter_start' => $elecStart,
                            'elec_meter_end' => $elecStart + rand(80, 250),
                            'water_meter_start' => $waterStart,
                            'water_meter_end' => $waterStart + rand(10, 40),
                        ]);

                        // Keep the very first guaranteed invoice unpaid, per the build spec's
                        // "one active long-stay with an unpaid invoice" demo requirement.
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
                // Room might be occupied during this exact date overlap due to randomization, just skip
                continue;
            }
        }
    }
}
