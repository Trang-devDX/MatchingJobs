<?php

namespace App\Enums;

enum JobListingStatusEnum: int
{
    case PUBLISHED = 1;
    case DRAFT = 2;
    case CLOSED = 9;
    case OFFERED = 5;

    /**
     * Get the label for the enum value.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::PUBLISHED => 'Published',
            self::DRAFT => 'Draft',
            self::CLOSED => 'Closed',
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

    /**
     * Get enum values allowed for creation.
     *
     * @return array
     */
    public static function allowedForCreate(): array
    {
        return [self::PUBLISHED->value, self::DRAFT->value];
    }

    /**
     * Get all enum values as a string.
     *
     * @return string
     */
    public static function getValuesString(): string
    {
        return implode(',', self::values());
    }
}
