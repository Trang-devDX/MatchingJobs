<?php

namespace App\Services;

use App\Exceptions\NotFoundException;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class NotificationService
{
    /**
     * @return Collection<int, DatabaseNotification>
     */
    public function list(): Collection
    {
        return $this->actor()->notifications()->latest()->limit(20)->get();
    }

    public function unreadCount(): int
    {
        return $this->actor()->unreadNotifications()->count();
    }

    public function markRead(string $id): void
    {
        $notification = $this->actor()->notifications()->whereKey($id)->first();
        if (! $notification) {
            throw new NotFoundException('Notification not found.');
        }

        $notification->markAsRead();
    }

    public function markAllRead(): void
    {
        $this->actor()->unreadNotifications->markAsRead();
    }

    private function actor(): Model
    {
        $user = Auth::user();
        if ($user instanceof Model) {
            return $user;
        }

        throw new NotFoundException('Notification not found.');
    }
}
