<?php

namespace App\Exceptions;

class NotFoundException extends BaseException
{
    protected static function defaultMessage(): string
    {
        return 'Resource not found';
    }

    protected function statusCode(): int
    {
        return 404;
    }
}
