<?php

namespace App\Enums;

enum OnboardProgressStatusEnum: int
{
    case COMPLETED = 1;
    case SKIP = 2;
    case PENDING = 3;

    /**
     * Get the label for the enum value.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::COMPLETED => 'Completed',
            self::SKIP => 'Skip',
            self::PENDING => 'Pending',
        };
    }

    /**
     * Get all enum values.
     *
     * @return array<int>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
