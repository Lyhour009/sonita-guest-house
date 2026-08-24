<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $latestInvoice = $this->whenLoaded('invoices', fn () => $this->invoices->first());

        return [
            'id' => $this->id,
            'reservation_type' => $this->reservation_type,
            'check_in_date' => $this->check_in_date?->toDateString(),
            'check_out_date' => $this->check_out_date?->toDateString(),
            'start_date' => $this->start_date?->toDateString(),
            'end_date' => $this->end_date?->toDateString(),
            'deposit_amount' => $this->deposit_amount ? (float) $this->deposit_amount : null,
            'monthly_due_day' => $this->monthly_due_day,
            'num_guests' => $this->num_guests ?? 1,
            'created_at' => $this->created_at?->format('M d, Y H:i'),
            'status' => $this->status,
            'notes' => $this->notes,
            'total_amount' => (float) $this->total_amount,
            'guest' => $this->whenLoaded('guest', fn () => [
                'id' => $this->guest?->id,
                'full_name' => $this->guest?->full_name ?? 'Guest',
                'email' => $this->guest?->email ?? '',
                'phone_number' => $this->guest?->phone_number,
                'completed_stays_count' => $this->guest?->completed_stays_count ?? null,
            ]),
            'room' => $this->whenLoaded('room', fn () => [
                'id' => $this->room->id,
                'room_number' => $this->room->room_number,
                'room_type' => $this->room->room_type,
                'price_per_night' => (float) $this->room->price_per_night,
                'price_per_month' => (float) $this->room->price_per_month,
            ]),
            'latest_invoice' => $latestInvoice ? [
                'id' => $latestInvoice->id,
                'total_amount' => (float) $latestInvoice->total_amount,
                'room_charge' => (float) $latestInvoice->room_charge,
                'service_charge' => (float) $latestInvoice->service_charge,
                'tax_amount' => (float) $latestInvoice->tax_amount,
                'status' => $latestInvoice->status,
                'due_date' => $latestInvoice->due_date?->toDateString(),
            ] : null,
            'services' => $this->whenLoaded('services', fn () => $this->services->map(fn ($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'price' => (float) $s->price,
                'pivot_id' => $s->pivot->id,
                'quantity' => (int) $s->pivot->quantity,
                'unit_price' => (float) $s->pivot->unit_price,
            ])),
        ];
    }
}
