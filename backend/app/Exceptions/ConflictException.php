<?php

namespace App\Exceptions;

class ConflictException extends BaseException
{
    protected static function defaultMessage(): string
    {
        return 'Conflict';
    }

    protected function statusCode(): int
    {
        return 409;
    }
}
