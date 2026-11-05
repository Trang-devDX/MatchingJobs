<?php

namespace App\Enums;

enum JobApplicationStatusEnum: int
{
    case PENDING = 1;
    case REVIEWED = 2;
    case SHORTLISTED = 3;
    case INTERVIEWED = 4;
    case OFFERED = 5;
    case REJECTED = 6;
    case WITHDRAWN = 7;
    case HIRED = 8;

    public function label(): string
    {
        return match ($this) {
            self::PENDING => 'Pending',
            self::REVIEWED => 'Reviewed',
            self::SHORTLISTED => 'Shortlisted',
            self::INTERVIEWED => 'Interviewed',
            self::OFFERED => 'Offered',
            self::REJECTED => 'Rejected',
            self::WITHDRAWN => 'Withdrawn',
            self::HIRED => 'Hired',
        };
    }

    public function seekerMessage(string $title, string $company): string
    {
        return match ($this) {
            self::PENDING => "You applied for {$title} at {$company}.",
            self::REVIEWED => "Your application for {$title} at {$company} was reviewed.",
            self::SHORTLISTED => "Your application for {$title} at {$company} was shortlisted.",
            self::INTERVIEWED => "Your application for {$title} at {$company} moved to interview.",
            self::OFFERED => "You received an offer for {$title} at {$company}.",
            self::REJECTED => "Your application for {$title} at {$company} was not selected.",
            self::WITHDRAWN => "Your application for {$title} at {$company} was withdrawn.",
            self::HIRED => "Your application for {$title} at {$company} led to a hire.",
        };
    }

    /**
     * @return list<int>
     */
    public static function staffCanSet(): array
    {
        return [
            self::REVIEWED->value,
            self::SHORTLISTED->value,
            self::INTERVIEWED->value,
            self::OFFERED->value,
            self::REJECTED->value,
            self::WITHDRAWN->value,
            self::HIRED->value,
        ];
    }
}
