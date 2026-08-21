import { router } from '@inertiajs/react';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import type { FlashToast } from '@/types/ui';

const khmerSuccessTranslations: Record<string, string> = {
    'Reservation created successfully.': 'ការកក់បន្ទប់ត្រូវបានបង្កើតដោយជោគជ័យ!',
    'Reservation confirmed.': 'ការកក់ត្រូវបានបញ្ជាក់ដោយជោគជ័យ!',
    'Check-in completed successfully.': 'ភ្ញៀវបានចូលស្នាក់នៅដោយជោគជ័យ!',
    'Check-out completed successfully.': 'ភ្ញៀវបានចេញពីការស្នាក់នៅដោយជោគជ័យ!',
    'Reservation cancelled.': 'ការកក់ត្រូវបានបោះបង់ដោយជោគជ័យ!',
    'Room created successfully.': 'បន្ទប់ត្រូវបានបង្កើតដោយជោគជ័យ!',
    'Room updated successfully.': 'បន្ទប់ត្រូវបានកែប្រែដោយជោគជ័យ!',
    'Service created successfully.': 'សេវាកម្មត្រូវបានបង្កើតដោយជោគជ័យ!',
    'Service updated successfully.': 'សេវាកម្មត្រូវបានកែប្រែដោយជោគជ័យ!',
    'Payment recorded successfully.': 'ការទូទាត់ប្រាក់ត្រូវបានកត់ត្រាដោយជោគជ័យ!',
    'Payment rejected.': 'ការទូទាត់ប្រាក់ត្រូវបានបដិសេធ!',
    'Maintenance request created.': 'សំណើជួសជុលត្រូវបានបង្កើត!',
    'Maintenance status updated.': 'ស្ថានភាពសំណើជួសជុលត្រូវបានកែប្រែ!',
};

interface FlashPayload {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
    info?: string | null;
    toast?: FlashToast | null;
}

export function useFlashToast(): void {
    const lastToastRef = useRef<string | null>(null);

    useEffect(() => {
        const processFlash = (flash?: FlashPayload) => {
            if (!flash) return;

            const locale = (typeof localStorage !== 'undefined' ? localStorage.getItem('locale') : 'en') || 'en';
            const translateMsg = (msg: string) => {
                if (locale === 'km' && khmerSuccessTranslations[msg]) {
                    return khmerSuccessTranslations[msg];
                }
                return msg;
            };

            if (flash.toast) {
                const key = `toast-${flash.toast.type}-${flash.toast.message}-${Date.now()}`;
                if (lastToastRef.current !== key) {
                    lastToastRef.current = key;
                    toast[flash.toast.type](translateMsg(flash.toast.message));
                }
            } else if (flash.success) {
                const key = `success-${flash.success}-${Date.now()}`;
                if (lastToastRef.current !== key) {
                    lastToastRef.current = key;
                    toast.success(translateMsg(flash.success));
                }
            } else if (flash.error) {
                const key = `error-${flash.error}-${Date.now()}`;
                if (lastToastRef.current !== key) {
                    lastToastRef.current = key;
                    toast.error(translateMsg(flash.error));
                }
            } else if (flash.warning) {
                const key = `warning-${flash.warning}-${Date.now()}`;
                if (lastToastRef.current !== key) {
                    lastToastRef.current = key;
                    toast.warning(translateMsg(flash.warning));
                }
            } else if (flash.info) {
                const key = `info-${flash.info}-${Date.now()}`;
                if (lastToastRef.current !== key) {
                    lastToastRef.current = key;
                    toast.info(translateMsg(flash.info));
                }
            }
        };

        const removeNavigate = router.on('navigate', (event) => {
            const flash = (event.detail.page.props as { flash?: FlashPayload })?.flash;
            processFlash(flash);
        });

        const removeFlash = router.on('flash', (event: unknown) => {
            const flash = (event as CustomEvent<{ flash?: FlashPayload }>)?.detail?.flash;
            processFlash(flash);
        });

        return () => {
            removeNavigate();
            removeFlash();
        };
    }, []);
}
