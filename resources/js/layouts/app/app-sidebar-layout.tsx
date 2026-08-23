import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import type { AppLayoutProps } from '@/types';

/**
 * Shell for every authenticated page.
 *
 * Deliberately adds no padding of its own — pages own their spacing
 * (`p-4`, `p-6 lg:p-10`), so padding here would double up everywhere.
 * `AppContent` already renders the `<main>` element via `SidebarInset`.
 */
export default function AppSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    return (
        <AppShell variant="sidebar">
            <a
                href="#main-content"
                className="sr-only rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50"
            >
                Skip to content
            </a>

            <AppSidebar />

            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />

                {/*
                 * min-w-0 lets wide children (tables, timelines) shrink inside the
                 * flex column instead of forcing the inset wider than the viewport.
                 */}
                <div id="main-content" className="flex min-w-0 flex-1 flex-col">
                    {children}
                </div>
            </AppContent>
        </AppShell>
    );
}
