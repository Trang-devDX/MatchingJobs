<?php

namespace App\Enums;

enum SalaryTypeEnum: int
{
    case SALARY = 1;
    case WAGE = 2;

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
