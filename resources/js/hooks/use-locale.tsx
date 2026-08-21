import { useSyncExternalStore } from 'react';

export type Locale = 'en' | 'km';

export type UseLocaleReturn = {
    readonly locale: Locale;
    readonly updateLocale: (locale: Locale) => void;
};

const listeners = new Set<() => void>();
let currentLocale: Locale = 'en';

const getStoredLocale = (): Locale => {
    if (typeof window === 'undefined') {
        return 'en';
    }

    return (localStorage.getItem('locale') as Locale) || 'en';
};

const subscribe = (callback: () => void) => {
    listeners.add(callback);

    return () => listeners.delete(callback);
};

const notify = (): void => listeners.forEach((listener) => listener());

export function initializeLocale(): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (!localStorage.getItem('locale')) {
        localStorage.setItem('locale', 'en');
    }

    currentLocale = getStoredLocale();
}

export function useLocale(): UseLocaleReturn {
    const locale: Locale = useSyncExternalStore(
        subscribe,
        () => currentLocale,
        () => 'en',
    );

    const updateLocale = (next: Locale): void => {
        currentLocale = next;
        localStorage.setItem('locale', next);
        notify();
    };

    return { locale, updateLocale } as const;
}
