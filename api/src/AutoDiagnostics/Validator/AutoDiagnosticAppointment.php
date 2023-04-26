<?php

declare(strict_types=1);

namespace App\AutoDiagnostics\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class AutoDiagnosticAppointment extends Constraint
{
    public string $messageNotYourAppointment = 'This appointment does not belong to you.';

    public string $mode = 'strict';
}
