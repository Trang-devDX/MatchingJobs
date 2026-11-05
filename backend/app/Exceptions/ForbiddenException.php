<?php

namespace App\Exceptions;

class ForbiddenException extends BaseException
{
    protected static function defaultMessage(): string
    {
        return 'Forbidden';
    }

    protected function statusCode(): int
    {
        return 403;
    }
}
