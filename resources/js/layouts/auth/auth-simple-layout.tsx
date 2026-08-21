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
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-40 right-10 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
            </div>

            {/* Top Bar with Language Dropdown */}
            <header className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex items-center justify-between">
                <Link
                    href={home()}
                    className="group flex items-center gap-2.5 text-sm font-semibold text-foreground transition-opacity hover:opacity-80"
                >
                    <div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white shadow-xs dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300 dark:text-neutral-900">
                        <AppLogoIcon className="size-4.5 fill-current" />
                    </div>
                    <span className="hidden sm:inline font-sans">Hour Guest House</span>
                </Link>

                <LanguageToggle />
            </header>

            {/* Centered Auth Card */}
            <div className="w-full max-w-md my-auto pt-12 sm:pt-0">
                <div className="relative rounded-2xl border border-border/70 bg-card/95 p-6 sm:p-8 shadow-xl shadow-black/5 backdrop-blur-xl dark:shadow-black/20">
                    <div className="mb-6 flex flex-col items-center text-center">
                        <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white shadow-md ring-4 ring-primary/10 transition-transform duration-300 hover:scale-105 dark:from-neutral-100 dark:via-neutral-200 dark:to-neutral-300 dark:text-neutral-900">
                            <AppLogoIcon className="size-6.5 fill-current" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight text-foreground font-sans">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground font-sans">
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
