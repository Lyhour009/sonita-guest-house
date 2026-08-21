import { useCallback } from 'react';
import { useLocale } from '@/hooks/use-locale';
import { translate } from '@/lib/i18n/translate';

export function useTranslation() {
    const { locale, updateLocale } = useLocale();

    const t = useCallback(
        (key: string, params?: Record<string, string | number>) =>
            translate(locale, key, params),
        [locale],
    );

    return { t, locale, updateLocale } as const;
}
