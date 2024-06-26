<?php

declare(strict_types=1);

namespace App\AutoDiagnostics\Validator;

use App\Entity\Appointment;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;
use Symfony\Contracts\Translation\TranslatorInterface;

class AutoDiagnosticAppointmentValidator extends ConstraintValidator
{
    public function __construct(private readonly Security $security, private readonly TranslatorInterface $translator)
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
        if (!$currentUser) {
            throw new AccessDeniedHttpException($this->translator->trans('403_access.denied.role', domain: 'validators'));
        }

        if ($value->customer && $value->customer->id === $currentUser->id) {
            return;
        }

        if ($value->customer && $value->customer->id !== $currentUser->id && !$currentUser->isBoss() && !$currentUser->isEmployee() && !$currentUser->isAdmin()) {
            $this->context->buildViolation($constraint->messageNotYourAppointment)->addViolation();
        }
    }
}
