<?php

declare(strict_types=1);

namespace App\Appointments\Validator;

use App\Entity\Appointment;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

final class AppointmentStateValidator extends ConstraintValidator
{
    /** @param Appointment $value */
    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof AppointmentState) {
            throw new UnexpectedTypeException($constraint, AppointmentState::class);
        }

        if (!in_array($value->status, AppointmentState::VALID_STATUS)) {
            $this->context->buildViolation((string) $constraint->message)
                ->addViolation();
        }
    }
}
