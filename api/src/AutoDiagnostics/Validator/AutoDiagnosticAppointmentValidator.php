<?php

declare(strict_types=1);

namespace App\AutoDiagnostics\Validator;

use App\Entity\Appointment;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class AutoDiagnosticAppointmentValidator extends ConstraintValidator
{
    public function __construct(private readonly Security $security)
    {
    }

    /**
     * @param AutoDiagnosticAppointment $constraint
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!$value instanceof Appointment) {
            throw new UnexpectedValueException($value, 'appointment');
        }

        /** @var User|null $currentUser */
        $currentUser = $this->security->getUser();

        if (!$currentUser || (!$currentUser->isAdmin() && $value->customer->id !== $this->security->getUser()->id)) {
            $this->context->buildViolation($constraint->messageNotYourAppointment)->addViolation();
        }
    }
}
