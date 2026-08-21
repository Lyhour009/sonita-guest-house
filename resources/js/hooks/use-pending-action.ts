import type { VisitOptions } from '@inertiajs/core';
import { useCallback, useState } from 'react';

/**
 * Tracks which single action (identified by an arbitrary key, e.g. `confirm-${id}`)
 * is currently in flight, so a button can disable + show a spinner only for the
 * action it triggered, and callers can't double-submit the same request.
 */
export function usePendingAction() {
    const [pendingKey, setPendingKey] = useState<string | null>(null);

    const withPending = useCallback(
        (key: string, options: VisitOptions = {}): VisitOptions => ({
            ...options,
            onStart: () => setPendingKey(key),
            onFinish: () =>
                setPendingKey((current) => (current === key ? null : current)),
        }),
        [],
    );

    return {
        isPending: (key: string) => pendingKey === key,
        isAnyPending: pendingKey !== null,
        withPending,
    } as const;
}
