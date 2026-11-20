<?php

namespace App\Enums;

enum PaymentStatusEnum: int
{
    case PENDING = 1;
    case PAID = 2;
    case EXPIRED = 3;
    case FAILED = 9;

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::PAID => 'Paid',
            self::EXPIRED => 'Expired',
            self::FAILED => 'Failed',
        };
    }
}
