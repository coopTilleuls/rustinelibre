<?php

declare(strict_types=1);

namespace App\Repairers\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class RepairerOpenings extends Constraint
{
    public string $messageNotValidDay = 'repairer.opening.valid_days';
    public string $messageNotValidTime = 'repairer.opening.valid_time';
    public string $messageHoursOverlapped = 'repairer.opening.overlapped';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
