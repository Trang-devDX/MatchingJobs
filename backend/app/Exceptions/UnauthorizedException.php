<?php

namespace App\Exceptions;

class UnauthorizedException extends BaseException
{
    protected static function defaultMessage(): string
    {
        return 'Unauthorized access';
    }

    protected function statusCode(): int
    {
        return 401;
    }
}
