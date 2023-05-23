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

        if ($this->security->isGranted('ROLE_EMPLOYEE')) {
            $currentRepairer = $currentUser->repairerEmployee->repairer;

            if (!$currentRepairer) {
                $this->context->buildViolation($constraint->messageCannotWriteMaintenanceForThisBike)->addViolation();
            }

            $appointment = $this->appointmentRepository->findOneBy([
                'customer' => $bikeOwner,
                'repairer' => $currentRepairer,
            ]);

            if (!$appointment) {
                $this->context->buildViolation($constraint->messageCannotWriteMaintenanceForThisBike)->addViolation();
            }
        } elseif ($this->security->isGranted('ROLE_BOSS')) {
            $currentRepairer = $currentUser->repairer;

            if (!$currentRepairer) {
                $this->context->buildViolation($constraint->messageCannotWriteMaintenanceForThisBike)->addViolation();
            }

            $appointment = $this->appointmentRepository->findOneBy([
                'customer' => $bikeOwner,
                'repairer' => $currentRepairer,
            ]);

            if (!$appointment) {
                $this->context->buildViolation($constraint->messageCannotWriteMaintenanceForThisBike)->addViolation();
            }
        } elseif ($bikeOwner !== $currentUser) {
            $this->context->buildViolation($constraint->messageCannotWriteMaintenanceForThisBike)->addViolation();
        }
    }
}
