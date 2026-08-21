import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getStoredLocale } from '@/hooks/use-locale';
import { translate } from '@/lib/i18n/translate';
import type { FlashToast } from '@/types/ui';

interface FlashPayload {
    toast?: FlashToast | null;
}

export function useFlashToast(): void {
    const lastToastRef = useRef<string | null>(null);

    useEffect(() => {
        const processFlash = (flash?: FlashPayload) => {
            if (!flash?.toast) {
                return;
            }

            const { type, key, params } = flash.toast;
            const dedupeKey = `${type}-${key}-${JSON.stringify(params ?? {})}`;

            if (lastToastRef.current === dedupeKey) {
                return;
            }

            lastToastRef.current = dedupeKey;
            toast[type](translate(getStoredLocale(), key, params));

            // Only suppress a duplicate firing within the same tick (e.g. both the
            // 'navigate' and 'flash' events carrying the same payload); later,
            // genuinely repeated actions should still toast again.
            setTimeout(() => {
                if (lastToastRef.current === dedupeKey) {
                    lastToastRef.current = null;
                }
            }, 0);
        };

        const removeNavigate = router.on('navigate', (event) => {
            const flash = (event.detail.page.props as { flash?: FlashPayload })
                ?.flash;
            processFlash(flash);
        });

        const removeFlash = router.on('flash', (event: unknown) => {
            const flash = (event as CustomEvent<{ flash?: FlashPayload }>)
                ?.detail?.flash;
            processFlash(flash);
        });

        return () => {
            removeNavigate();
            removeFlash();
        };
    }, []);
}
