<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        {{-- Inline script to detect system dark mode preference and apply it immediately --}}
        <script>
            (function() {
                const appearance = '{{ $appearance ?? "system" }}';

                if (appearance === 'system') {
                    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                    if (prefersDark) {
                        document.documentElement.classList.add('dark');
                    }
                }
            })();
        </script>

        {{-- Inline style to set the HTML background/font before the stylesheet loads, so the dev
             server's brief unstyled window (Vite injects CSS via JS in dev, not a blocking <link>)
             renders close to the final look instead of flashing default browser styling.

             The @font-face rules are duplicated from app.css on purpose: a font-family name only
             resolves once its @font-face is registered, and app.css itself hasn't loaded yet during
             this window, so referencing 'Siemreap'/'Moul' below would otherwise fall through to the
             OS's default font until app.css catches up.

             Siemreap and Moul each only ship a single static weight, so both are registered across
             the full 100-900 range to keep bold/semibold text on the face's real design instead of
             the browser's synthesized faux-bold — see app.css. Moul is reserved for <h1> page titles
             (matching app.css's `h1 { font-family: var(--font-heading) }` base rule), so it's applied
             here too to avoid a flash of the wrong font on page titles. --}}
        <style>
            @font-face {
                font-family: 'Siemreap';
                font-style: normal;
                font-weight: 100 900;
                font-display: swap;
                src: url('{{ Vite::asset('resources/fonts/Siemreap-Regular.ttf') }}') format('truetype');
            }

            @font-face {
                font-family: 'Moul';
                font-style: normal;
                font-weight: 100 900;
                font-display: swap;
                src: url('{{ Vite::asset('resources/fonts/Moul-Regular.ttf') }}') format('truetype');
            }

            @font-face {
                font-family: 'Inter';
                font-style: normal;
                font-weight: 100 900;
                font-display: swap;
                src: url('{{ Vite::asset('resources/fonts/Inter.ttf') }}') format('truetype');
            }

            html {
                background-color: oklch(1 0 0);
            }

            html.dark {
                background-color: oklch(0.145 0 0);
            }

            body {
                font-family:
                    'Siemreap', 'Inter', ui-sans-serif, system-ui,
                    sans-serif;
                background-color: inherit;
                color: oklch(0.18 0.025 260);
            }

            h1 {
                font-family: 'Moul', 'Siemreap', 'Inter', ui-sans-serif, sans-serif !important;
            }

            html.dark body {
                color: oklch(0.98 0.005 250);
            }
        </style>

        {{-- Preload the font files themselves so the fetch starts immediately, in parallel with
             the @font-face rules above being parsed. --}}
        <link rel="preload" as="font" type="font/ttf" href="{{ Vite::asset('resources/fonts/Siemreap-Regular.ttf') }}" crossorigin>
        <link rel="preload" as="font" type="font/ttf" href="{{ Vite::asset('resources/fonts/Moul-Regular.ttf') }}" crossorigin>
        <link rel="preload" as="font" type="font/ttf" href="{{ Vite::asset('resources/fonts/Inter.ttf') }}" crossorigin>

        <link rel="icon" href="/favicon.ico" sizes="any">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
        <link rel="apple-touch-icon" href="/apple-touch-icon.png">

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
        <x-inertia::head>
            <title>{{ config('app.name', 'Hour Guest House') }}</title>
        </x-inertia::head>
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
