<?php

declare(strict_types=1);

namespace App\Repairers\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class RepairerClosing extends Constraint
{
    public string $messageNotValidTime = 'The endDate cannot be before startDate';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
