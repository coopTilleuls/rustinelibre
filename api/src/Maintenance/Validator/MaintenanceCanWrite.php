<?php

declare(strict_types=1);

namespace App\Maintenance\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class MaintenanceCanWrite extends Constraint
{
    public string $messageCannotWriteMaintenanceForThisBike = 'maintenance.writer';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
