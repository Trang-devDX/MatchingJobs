<?php

namespace App\Exceptions;

class InvalidStripeSignatureException extends BaseException
{
    protected static function defaultMessage(): string
    {
        return 'Invalid Stripe signature.';
    }

    protected function statusCode(): int
    {
        return 400;
    }
}
