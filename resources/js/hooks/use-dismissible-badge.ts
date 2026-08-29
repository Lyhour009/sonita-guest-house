import { useCallback, useState } from 'react';

const STORAGE_PREFIX = 'sidebar-badge-seen';

function readSeenCount(storageKey: string): number {
    try {
        const raw = window.localStorage.getItem(storageKey);

        return raw ? Number(raw) || 0 : 0;
    } catch {
        return 0;
    }
}

/**
 * Sidebar nav badges show a real pending-work count (see ResolveSidebarBadgeCounts
 * on the backend) — it only drops when the underlying task is actually resolved.
 * On top of that, once a user visits or dismisses a badge we hide the number
 * until the count grows past what they already saw, YouTube-style. This is a
 * "have you looked" layer, not a claim that the work is done — the linked
 * page still flags every genuinely pending row regardless of this state.
 *
 * `seen` starts empty on every render (server and client alike) so the first
 * paint always matches the server-rendered markup; `hydrate` pulls in a
 * previously-dismissed count from localStorage but must only be called from
 * an effect (post-hydration), never during render, or server/client output
 * diverges and React discards + re-renders the whole tree.
 */
export function useDismissibleBadge(userId: string | undefined) {
    const [seen, setSeen] = useState<Record<string, number>>({});

    const keyFor = useCallback(
        (id: string) => `${STORAGE_PREFIX}:${userId ?? 'anon'}:${id}`,
        [userId],
    );

    const isVisible = useCallback(
        (id: string, count: number | undefined) => {
            if (!count || count <= 0) {
                return false;
            }

            const lastSeen = seen[keyFor(id)] ?? 0;

            return count > lastSeen;
        },
        [keyFor, seen],
    );

    const dismiss = useCallback(
        (id: string, count: number | undefined) => {
            if (!count) {
                return;
            }

            const storageKey = keyFor(id);

            setSeen((current) =>
                current[storageKey] === count
                    ? current
                    : { ...current, [storageKey]: count },
            );

            try {
                window.localStorage.setItem(storageKey, String(count));
            } catch {
                // Storage unavailable (private mode, quota) — badge just won't persist dismissal.
            }
        },
        [keyFor],
    );

    const hydrate = useCallback(
        (id: string) => {
            const storageKey = keyFor(id);
            const stored = readSeenCount(storageKey);

            if (stored > 0) {
                setSeen((current) =>
                    current[storageKey] === stored
                        ? current
                        : { ...current, [storageKey]: stored },
                );
            }
        },
        [keyFor],
    );

    return { isVisible, dismiss, hydrate };
}
