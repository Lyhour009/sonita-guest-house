import { Form } from '@inertiajs/react';
import { Send, Star } from 'lucide-react';
import { useState } from 'react';
import ReviewController from '@/actions/App/Http/Controllers/ReviewController';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { useTranslation } from '@/hooks/use-translation';
import { cn } from '@/lib/utils';
import type { GuestReviewableReservation } from '@/types';

type Props = {
    reservation: GuestReviewableReservation;
};

export default function ReviewDialog({ reservation }: Props) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 rounded-lg text-xs"
                >
                    <Star className="size-3.5" />
                    {t('dashboard.guest.leaveReview')}
                </Button>
            </DialogTrigger>
            <DialogContent className="rounded-2xl sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {t('dashboard.guest.reviewDialog.title', {
                            room: reservation.room.room_number,
                        })}
                    </DialogTitle>
                </DialogHeader>

                <Form
                    {...ReviewController.store.form(reservation.id)}
                    onSuccess={() => setOpen(false)}
                    className="space-y-4"
                >
                    {({ processing, errors }) => (
                        <>
                            <input type="hidden" name="rating" value={rating} />

                            <div className="grid gap-1.5">
                                <Label>
                                    {t(
                                        'dashboard.guest.reviewDialog.ratingLabel',
                                    )}
                                </Label>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() =>
                                                setHoverRating(star)
                                            }
                                            onMouseLeave={() =>
                                                setHoverRating(0)
                                            }
                                            className="cursor-pointer"
                                        >
                                            <Star
                                                className={cn(
                                                    'size-7 transition-colors',
                                                    (hoverRating || rating) >=
                                                        star
                                                        ? 'fill-amber-400 text-amber-400'
                                                        : 'text-muted-foreground/40',
                                                )}
                                            />
                                        </button>
                                    ))}
                                </div>
                                <InputError message={errors.rating} />
                            </div>

                            <div className="grid gap-1.5">
                                <Label htmlFor="review_comment">
                                    {t(
                                        'dashboard.guest.reviewDialog.commentLabel',
                                    )}
                                </Label>
                                <Textarea
                                    id="review_comment"
                                    name="comment"
                                    placeholder={t(
                                        'dashboard.guest.reviewDialog.commentPlaceholder',
                                    )}
                                />
                                <InputError message={errors.comment} />
                            </div>

                            <DialogFooter>
                                <Button
                                    type="submit"
                                    disabled={processing || rating === 0}
                                    className="rounded-xl font-semibold"
                                >
                                    {processing ? (
                                        <Spinner className="mr-2" />
                                    ) : (
                                        <Send className="mr-2 size-4" />
                                    )}
                                    {t('dashboard.guest.reviewDialog.submit')}
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </Form>
            </DialogContent>
        </Dialog>
    );
}
