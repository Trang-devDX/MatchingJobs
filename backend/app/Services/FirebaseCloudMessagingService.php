<?php

namespace App\Services;

use App\Repositories\DeviceTokenRepository;
use Illuminate\Support\Facades\App;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\Notification;
use Throwable;

class FirebaseCloudMessagingService
{
    public function __construct(private readonly DeviceTokenRepository $deviceTokens) {}

    /**
     * @param  list<string>  $tokens
     * @param  array<string, mixed>  $data
     */
    public function send(array $tokens, string $title, string $body, array $data): void
    {
        $tokens = array_values(array_unique(array_filter(
            $tokens,
            fn ($token) => is_string($token) && $token !== '',
        )));

        if ($tokens === []) {
            return;
        }

        try {
            /** @var Messaging $messaging */
            $messaging = App::make(Messaging::class);
        } catch (Throwable $exception) {
            report($exception);

            return;
        }

        $message = CloudMessage::new()
            ->withNotification(Notification::create($title, $body))
            ->withData($this->stringData($data));

        $report = $messaging->sendMulticast($message, $tokens);
        $stale = array_values(array_unique([
            ...$report->invalidTokens(),
            ...$report->unknownTokens(),
        ]));

        if ($stale !== []) {
            $this->deviceTokens->deleteByTokens($stale);
        }
    }

    /**
     * FCM data values must be strings.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, string>
     */
    private function stringData(array $data): array
    {
        $payload = [];
        foreach ($data as $key => $value) {
            if ($value === null || is_array($value)) {
                continue;
            }
            $payload[(string) $key] = (string) $value;
        }

        return $payload;
    }
}
