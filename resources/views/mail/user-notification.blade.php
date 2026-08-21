<x-mail::message>
{{ $notificationMessage }}

@if ($link)
<x-mail::button :url="$link">
View details
</x-mail::button>
@endif

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
