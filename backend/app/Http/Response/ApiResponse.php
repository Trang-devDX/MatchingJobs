<?php

namespace App\Http\Response;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

class ApiResponse
{
    /**
     * Success response
     *
     * @param mixed|null $data
     * @param string $message
     * @param int $status
     * @param array|null $meta
     * @return JsonResponse
     */
    public static function success(mixed $data = null, string $message = 'Success', int $status = 200, ?array $meta = null): JsonResponse
    {
        $response = [
            'success' => true,
            'data' => $data,
        ];

        if ($meta !== null) {
            $response['meta'] = $meta;
        }

        $response['message'] = $message;

        return response()->json($response, $status);
    }

    public static function paginated(mixed $data, LengthAwarePaginator $paginator, string $message = 'Success'): JsonResponse
    {
        return self::success($data, $message, meta: [
            'current_page' => $paginator->currentPage(),
            'last_page' => $paginator->lastPage(),
            'per_page' => $paginator->perPage(),
            'total' => $paginator->total(),
        ]);
    }

    /**
     * Error response
     *
     * @param string $message
     * @param int $status
     * @param mixed|null $errors
     * @param array $headers
     * @return JsonResponse
     */
    public static function error(string $message = 'Error', int $status = 400, mixed $errors = null, array $headers = []): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $status, $headers);
    }

    /**
     * Created response
     *
     * @param mixed|null $data
     * @param string $message
     * @return JsonResponse
     */
    public static function created(mixed $data = null, string $message = 'Created successfully'): JsonResponse
    {
        return self::success($data, $message, 201);
    }

    /**
     * Not found response
     *
     * @param string $message
     * @return JsonResponse
     */
    public static function notFound(string $message = 'Resource not found'): JsonResponse
    {
        return self::error($message, 404);
    }

    /**
     * Forbidden response
     *
     * @param string $message
     * @return JsonResponse
     */
    public static function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return self::error($message, 403);
    }

    /**
     * Unauthorized response
     *
     * @param string $message
     * @return JsonResponse
     */
    public static function unauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return self::error($message, 401);
    }

    /**
     * Validation error response
     *
     * @param mixed $errors
     * @param string $message
     * @return JsonResponse
     */
    public static function validationError(mixed $errors, string $message = 'Validation failed'): JsonResponse
    {
        return self::error($message, 422, $errors);
    }
}
