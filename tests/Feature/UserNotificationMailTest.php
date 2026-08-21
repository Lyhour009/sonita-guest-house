<?php

use App\Mail\UserNotificationMail;

test('known notification types get a human-readable subject', function () {
    $mail = new UserNotificationMail('payment_confirmed', 'Your payment has been confirmed.');

    expect($mail->envelope()->subject)->toBe('Your payment has been confirmed');
});

test('an unmapped notification type falls back to a humanized subject', function () {
    $mail = new UserNotificationMail('some_new_event', 'Something happened.');

    expect($mail->envelope()->subject)->toBe('Some new event');
});

test('the mail body includes the notification message and an optional link button', function () {
    $withLink = new UserNotificationMail('payment_confirmed', 'Your payment has been confirmed.', 'https://example.test/invoices');
    $withoutLink = new UserNotificationMail('payment_confirmed', 'Your payment has been confirmed.');

    $withLink->assertSeeInHtml('Your payment has been confirmed.');
    $withLink->assertSeeInHtml('https://example.test/invoices');
    $withoutLink->assertDontSeeInHtml('View details');
});
