import type { HTMLAttributes } from 'react';
import { useTranslation } from '@/hooks/use-translation';
import { translateValidationError } from '@/lib/i18n/validation-translator';
import { cn } from '@/lib/utils';

export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    const { locale } = useTranslation();

    if (!message) return null;

    const localizedMessage = translateValidationError(message, locale);

    return (
        <p
            {...props}
            className={cn('text-xs font-medium font-sans text-destructive dark:text-red-400 mt-1', className)}
        >
            {localizedMessage}
        </p>
    );
}
