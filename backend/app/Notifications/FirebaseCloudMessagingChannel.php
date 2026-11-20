<?php

namespace App\Notifications;

use App\Repositories\DeviceTokenRepository;
use App\Services\FirebaseCloudMessagingService;
use Illuminate\Notifications\Notification;
use Throwable;

class FirebaseCloudMessagingChannel
{
    public function __construct(
        private readonly FirebaseCloudMessagingService $messaging,
        private readonly DeviceTokenRepository $deviceTokens,
    ) {}

    public function send(object $notifiable, Notification $notification): void
    {
        if (! method_exists($notification, 'toFirebase')) {
            return;
        }

        $userId = $notifiable->user_id ?? null;
        if (! is_string($userId) || $userId === '') {
            return;
        }

        $tokens = $this->deviceTokens->tokensForUser($userId);
        if ($tokens === []) {
            return;
        }

        $message = $notification->toFirebase($notifiable);

        try {
            $this->messaging->send(
                $tokens,
                (string) $message['title'],
                (string) $message['body'],
                is_array($message['data'] ?? null) ? $message['data'] : [],
            );
        } catch (Throwable $exception) {
            report($exception);
        }
    }
}
