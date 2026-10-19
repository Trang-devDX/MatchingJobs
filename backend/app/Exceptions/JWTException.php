<?php

namespace App\Exceptions;

class JWTException extends BaseException
{
    protected static function defaultMessage(): string
    {
        return 'JWT error';
    }

    protected function statusCode(): int
    {
        return 401;
    }
}
