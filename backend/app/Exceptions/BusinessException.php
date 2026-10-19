<?php

namespace App\Exceptions;

class BusinessException extends BaseException
{
    protected static function defaultMessage(): string
    {
        return 'Business rule violation';
    }

    protected function statusCode(): int
    {
        return 400;
    }
}
