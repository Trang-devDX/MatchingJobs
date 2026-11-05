<?php

namespace App\Notifications;

use App\Models\JobApplication;
use Illuminate\Notifications\Notification;

class JobApplicationNotification extends Notification
{
    public function __construct(
        public JobApplication $application,
        public string $body,
        public string $event,
        public string $url,
    ) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', FirebaseCloudMessagingChannel::class];
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'title' => $this->body,
            'body' => $this->body,
            'event' => $this->event,
            'job_application_id' => $this->application->id,
            'url' => $this->url,
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function toFirebase(object $notifiable): array
    {
        return [
            'title' => 'MatchingJobs',
            'body' => $this->body,
            'data' => [
                'event' => $this->event,
                'job_application_id' => $this->application->id,
                'url' => $this->url,
            ],
        ];
    }
}
