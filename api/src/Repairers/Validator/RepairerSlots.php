<?php

declare(strict_types=1);

namespace App\Repairers\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class RepairerSlots extends Constraint
{
    public string $messageNotValidDurationSlot = 'The duration slot should be one of : 30 / 60 / 180 (min)';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
