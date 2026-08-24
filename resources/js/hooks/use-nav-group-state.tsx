import { useCallback, useSyncExternalStore } from 'react';

// v2: the default changed from "every group open" to "only the first group
// open" — bumped so stale v1 values (e.g. everything collapsed except one
// group from earlier testing) don't override the new default.
const STORAGE_PREFIX = 'nav-group-open:v2:';

const listeners = new Set<() => void>();

function subscribe(callback: () => void): () => void {
    listeners.add(callback);

    return () => listeners.delete(callback);
}

function notify(): void {
    listeners.forEach((listener) => listener());
}

function readStored(id: string, defaultOpen: boolean): boolean {
    if (typeof window === 'undefined') {
        return defaultOpen;
    }

    const stored = window.localStorage.getItem(STORAGE_PREFIX + id);

    return stored === null ? defaultOpen : stored === '1';
}

/**
 * Reads/writes localStorage via useSyncExternalStore rather than a lazy
 * useState initializer — this app renders with SSR, and a stored preference
 * only exists on the client, so a plain useState(() => readStored(...))
 * would read a different value during hydration than the server rendered,
 * causing a hydration mismatch. getServerSnapshot always returns
 * defaultOpen, matching the server's render exactly; React then reconciles
 * to the real stored value right after hydration.
 */
export function useNavGroupState(
    id: string | undefined,
    defaultOpen = true,
): [boolean, (open: boolean) => void] {
    const open = useSyncExternalStore(
        subscribe,
        () => (id ? readStored(id, defaultOpen) : true),
        () => defaultOpen,
    );

    const setOpen = useCallback(
        (next: boolean) => {
            if (id && typeof window !== 'undefined') {
                window.localStorage.setItem(
                    STORAGE_PREFIX + id,
                    next ? '1' : '0',
                );
            }

            notify();
        },
        [id],
    );

    return [open, setOpen];
}
