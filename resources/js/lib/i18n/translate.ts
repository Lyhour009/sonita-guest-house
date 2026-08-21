import type { Locale } from '@/hooks/use-locale';
import { en } from './en';
import { km } from './km';

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, km };

function lookup(dictionary: object, key: string): unknown {
    return key
        .split('.')
        .reduce<unknown>(
            (value, part) =>
                value && typeof value === 'object'
                    ? (value as Record<string, unknown>)[part]
                    : undefined,
            dictionary,
        );
}

export function translate(
    locale: Locale,
    key: string,
    params?: Record<string, string | number>,
): string {
    let value = lookup(dictionaries[locale], key);

    if (typeof value !== 'string') {
        value = lookup(dictionaries.en, key);
    }

    if (typeof value !== 'string') {
        return key;
    }

    if (!params) {
        return value;
    }

    return Object.entries(params).reduce(
        (result, [paramKey, paramValue]) =>
            result.replaceAll(`{{${paramKey}}}`, String(paramValue)),
        value,
    );
}
