<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AccountPasswordResetNotification extends Notification
{
    use Queueable;

    public function __construct(private readonly string $url) {}

    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage())
            ->subject('Reset your MatchingJobs password')
            ->line('We received a request to reset your password.')
            ->action('Reset password', $this->url)
            ->line('If you did not request a password reset, no further action is required.');
    }
}
