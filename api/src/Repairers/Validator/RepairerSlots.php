<?php

declare(strict_types=1);

namespace App\Repairers\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class RepairerSlots extends Constraint
{
    public string $messageNotValidDurationSlot = 'repairer.duration.slot';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
