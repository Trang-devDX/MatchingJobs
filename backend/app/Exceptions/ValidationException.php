<?php

namespace App\Exceptions;

class ValidationException extends BaseException
{
    protected static function defaultMessage(): string
    {
        return 'Validation failed';
    }

    protected function statusCode(): int
    {
        return 422;
    }
}
