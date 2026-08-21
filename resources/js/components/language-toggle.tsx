import type { HTMLAttributes } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

export default function LanguageToggle({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { locale, updateLocale } = useTranslation();

    const options = [
        { value: 'en', label: 'EN' },
        { value: 'km', label: 'ខ្មែរ' },
    ] as const;

    return (
        <div
            className={cn(
                'inline-flex gap-1 rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800',
                className,
            )}
            {...props}
        >
            {options.map(({ value, label }) => (
                <button
                    key={value}
                    type="button"
                    onClick={() => updateLocale(value)}
                    aria-label={
                        value === 'en' ? 'Switch to English' : 'ប្តូរទៅខ្មែរ'
                    }
                    className={cn(
                        'rounded-md px-2.5 py-1 text-sm transition-colors',
                        locale === value
                            ? 'bg-white shadow-xs dark:bg-neutral-700 dark:text-neutral-100'
                            : 'text-neutral-500 hover:bg-neutral-200/60 hover:text-black dark:text-neutral-400 dark:hover:bg-neutral-700/60',
                    )}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}
