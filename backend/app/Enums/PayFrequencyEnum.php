<?php

namespace App\Enums;

enum PayFrequencyEnum: int
{
    case DAILY = 1;
    case WEEKLY = 2;
    case FORTNIGHTLY = 3;
    case MONTHLY = 4;

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
