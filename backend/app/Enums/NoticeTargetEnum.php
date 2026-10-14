<?php

namespace App\Enums;

enum NoticeTargetEnum: int
{
    case ALL_COMPANIES = 1;
    case ALL_JOB_SEEKERS = 2;
    case ALL_SYSTEMS = 3;

    /**
     * Get the label for the enum value.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::ALL_COMPANIES => 'All Companies',
            self::ALL_JOB_SEEKERS => 'All Job Seekers',
            self::ALL_SYSTEMS => 'All Systems',
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
