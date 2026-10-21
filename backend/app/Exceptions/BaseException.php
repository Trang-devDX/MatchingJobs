<?php

namespace App\Exceptions;

use App\Http\Response\ApiResponse;
use Exception;
use Illuminate\Http\JsonResponse;

abstract class BaseException extends Exception
{
    public function __construct(
        ?string $message = null,
        protected array $errors = [],
    ) {
        parent::__construct($message ?? static::defaultMessage());
    }

    abstract protected static function defaultMessage(): string;

    abstract protected function statusCode(): int;

    public function render(): JsonResponse
    {
        return ApiResponse::error(
            $this->getMessage(),
            $this->statusCode(),
            $this->errors === [] ? null : $this->errors,
        );
    }

    public function getErrors(): array
    {
        return $this->errors;
    }
}
