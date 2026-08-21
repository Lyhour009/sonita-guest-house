import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export type AppVariant = 'header' | 'sidebar';

export type FlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    key: string;
    params?: Record<string, string | number>;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};
