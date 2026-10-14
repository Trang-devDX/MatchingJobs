<?php

namespace App\Enums;

enum JobListingPriorityEnum: int
{
    case HIGH = 1;
    case NORMAL = 2;
    case LOW = 3;

    /**
     * Get the label for the enum value.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::HIGH => 'High',
            self::NORMAL => 'Normal',
            self::LOW => 'Low',
        };
    }

    /**
     * Get all enum values.
     *
     * @return array
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    /**
     * Get all enum options as array.
     *
     * @return array
     */
    public static function options(): array
    {
        $options = [];
        foreach (self::cases() as $case) {
            $options[] = [
                'value' => $case->value,
                'label' => $case->label(),
            ];
        }
        return $options;
    }
}
