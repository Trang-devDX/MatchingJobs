<?php

namespace App\Enums;

enum ExperienceLevelEnum: int
{
    case ENTRY = 1;
    case MID = 2;
    case SENIOR = 3;
    case EXECUTIVE = 4;

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
