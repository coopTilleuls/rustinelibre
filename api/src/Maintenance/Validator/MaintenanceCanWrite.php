<?php

declare(strict_types=1);

namespace App\Maintenance\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class MaintenanceCanWrite extends Constraint
{
    public string $messageCannotWriteMaintenanceForThisBike = 'You cannot write a new maintenance intervention for this bike, you should be the bike owner, or have unless an appointment with the bike owner';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
