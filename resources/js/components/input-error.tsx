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

    if (!message) {
        return null;
    }

    const localizedMessage = translateValidationError(message, locale);

    return (
        <p
            {...props}
            className={cn(
                'mt-1 font-sans text-xs font-medium text-destructive dark:text-red-400',
                className,
            )}
        >
            {localizedMessage}
        </p>
    );
}
