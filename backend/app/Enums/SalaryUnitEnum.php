<?php

namespace App\Enums;

enum SalaryUnitEnum: int
{
    case HOUR = 1;
    case DAY = 2;
    case WEEK = 3;
    case FORTNIGHT = 4;
    case MONTH = 5;
    case YEAR = 6;

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
