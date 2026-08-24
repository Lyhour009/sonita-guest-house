<x-mail::message>
Good news — a room matching what you were looking for may now be available.

@if ($entry->from_date && $entry->to_date)
You told us you were interested in a {{ $entry->stay_type === 'long_stay' ? 'long stay' : 'short stay' }} from {{ $entry->from_date->toFormattedDateString() }} to {{ $entry->to_date->toFormattedDateString() }}.
@endif

<x-mail::button :url="route('home')">
Browse available rooms
</x-mail::button>

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
