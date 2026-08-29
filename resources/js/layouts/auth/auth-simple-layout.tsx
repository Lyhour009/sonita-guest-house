import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import LanguageToggle from '@/components/language-toggle';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center bg-background px-4 py-8 sm:px-6 md:p-10">
            {/* Background Ambient Glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute right-10 -bottom-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            </div>

            {/* Top Bar with Language Dropdown */}
            <header className="absolute top-4 right-4 left-4 flex items-center justify-between sm:top-6 sm:right-6 sm:left-6">
                <Link
                    href={home()}
                    className="group flex items-center gap-3 text-base font-semibold text-foreground transition-opacity hover:opacity-80"
                >
                    <div className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white shadow-xs dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300 dark:text-neutral-900">
                        <AppLogoIcon className="size-5 fill-current" />
                    </div>
                    <span className="hidden font-sans text-base sm:inline">
                        Hour Guest House
                    </span>
                </Link>

                <LanguageToggle />
            </header>

            {/* Centered Auth Card */}
            <div className="my-auto w-full max-w-[460px] pt-14 sm:pt-0">
                <div className="relative rounded-2xl border border-border/70 bg-card/95 p-7 shadow-xl shadow-black/5 backdrop-blur-xl sm:p-9 dark:shadow-black/20">
                    <div className="mb-7 flex flex-col items-center text-center">
                        <div className="mb-3.5 flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white shadow-md ring-4 ring-primary/10 transition-transform duration-300 hover:scale-105 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300 dark:text-neutral-900">
                            <AppLogoIcon className="size-7.5 fill-current" />
                        </div>
                        <h1 className="font-sans text-2xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-1.5 font-sans text-[15px] leading-relaxed text-muted-foreground">
                                {description}
                            </p>
                        )}
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
}
