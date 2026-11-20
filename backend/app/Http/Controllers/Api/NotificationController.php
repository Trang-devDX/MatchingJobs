<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use App\Http\Response\ApiResponse;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;

class NotificationController extends Controller
{
    public function __construct(private readonly NotificationService $notifications) {}

    public function index(): JsonResponse
    {
        return ApiResponse::success(NotificationResource::collection($this->notifications->list()));
    }

    public function count(): JsonResponse
    {
        return ApiResponse::success(['count' => $this->notifications->unreadCount()]);
    }

    public function read(string $id): JsonResponse
    {
        $this->notifications->markRead($id);

        return ApiResponse::success(null, 'Notification marked as read.');
    }

    public function readAll(): JsonResponse
    {
        $this->notifications->markAllRead();

        return ApiResponse::success(null, 'Notifications marked as read.');
    }
}
