import { Check, ChevronDown, Globe } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';

const languages = [
    {
        code: 'km',
        name: 'ភាសាខ្មែរ',
        shortName: 'ខ្មែរ',
    },
    {
        code: 'en',
        name: 'English',
        shortName: 'EN',
    },
] as const;

export default function LanguageToggle({
    className = '',
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    const { locale, updateLocale } = useTranslation();
    const currentLang =
        languages.find((l) => l.code === locale) ?? languages[0];

    return (
        <div
            className={cn('relative inline-flex items-center', className)}
            {...props}
        >
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="sm"
                        className="group flex h-9.5 items-center gap-2 rounded-lg border-sidebar-border/80 bg-background/80 px-3 text-[13.5px] font-medium shadow-2xs backdrop-blur-xs transition-all duration-200 hover:border-sidebar-border hover:bg-accent hover:text-accent-foreground data-[state=open]:border-primary/50 data-[state=open]:bg-accent"
                    >
                        <Globe className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
                        <span className="font-semibold">
                            {currentLang.shortName}
                        </span>
                        <ChevronDown className="size-3.5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="w-40 rounded-xl border-sidebar-border/80 p-1.5 shadow-lg"
                >
                    {languages.map(({ code, name }) => {
                        const isSelected = locale === code;

                        return (
                            <DropdownMenuItem
                                key={code}
                                onClick={() => updateLocale(code)}
                                className={cn(
                                    'flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-[13.5px] font-medium transition-colors',
                                    isSelected
                                        ? 'bg-primary/10 font-semibold text-primary dark:bg-primary/20 dark:text-primary-foreground'
                                        : 'hover:bg-accent hover:text-accent-foreground',
                                )}
                            >
                                <span className="font-sans">{name}</span>
                                {isSelected && (
                                    <Check className="size-4 animate-in text-primary duration-150 fade-in-0 zoom-in-75" />
                                )}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}
