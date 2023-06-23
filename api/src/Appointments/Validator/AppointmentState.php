<?php

declare(strict_types=1);

namespace App\Appointments\Validator;

use App\Entity\Appointment;
use Symfony\Component\Validator\Constraint;

#[\Attribute]
class AppointmentState extends Constraint
{
    public const VALID_STATUS = [
        Appointment::VALIDATED,
        Appointment::CANCEL,
        Appointment::REFUSED,
        Appointment::PENDING_REPAIRER,
    ];

    public string $message = 'This state is not a valid status';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
