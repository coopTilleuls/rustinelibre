<?php

declare(strict_types=1);

namespace App\Maintenance\Validator;

use App\Entity\Maintenance;
use App\Entity\User;
use App\Repository\AppointmentRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class MaintenanceCanWriteValidator extends ConstraintValidator
{
    public function __construct(private readonly Security $security, private readonly AppointmentRepository $appointmentRepository)
    {
    }

    /**
     * @param MaintenanceCanWrite $constraint
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!$value instanceof Maintenance) {
            throw new UnexpectedValueException($value, 'maintenance');
        }

        /** @var User $currentUser */
        $currentUser = $this->security->getUser();
        $bikeOwner = $value->bike->owner;
        $repairerFromEmployee = $currentUser?->repairerEmployee?->repairer;
        $repairerFromBoss = $currentUser?->repairer;

        if ($this->security->isGranted('ROLE_ADMIN') || $currentUser->id === $bikeOwner->id) {
            return;
        }

        if (
            !($this->security->isGranted('ROLE_EMPLOYEE') && $currentUser->repairerEmployee && $repairerFromEmployee) &&
            !($this->security->isGranted('ROLE_BOSS') && $repairerFromBoss)
        ) {
            $this->context->buildViolation($constraint->messageCannotWriteMaintenanceForThisBike)->addViolation();

            return;
        }

        $appointment = $this->appointmentRepository->findOneBy([
            'customer' => $bikeOwner,
            'repairer' => $repairerFromEmployee ?? $repairerFromBoss,
        ]);

        if ($appointment) {
            return;
        }

        $this->context->buildViolation($constraint->messageCannotWriteMaintenanceForThisBike)->addViolation();
    }
}
