<?php

namespace App\Enums;

enum NoticeTypeEnum: int
{
    case NEWS = 1;
    case ANNOUNCE = 2;

    /**
     * Get the label for the enum value.
     *
     * @return string
     */
    public function label(): string
    {
        return match ($this) {
            self::NEWS => 'News',
            self::ANNOUNCE => 'Announce',
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
