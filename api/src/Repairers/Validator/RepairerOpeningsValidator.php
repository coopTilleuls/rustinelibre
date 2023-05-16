<?php

declare(strict_types=1);

namespace App\Repairers\Validator;

use App\Entity\RepairerOpeningHours;
use App\Repository\RepairerOpeningHoursRepository;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class RepairerOpeningsValidator extends ConstraintValidator
{
    public function __construct(
        private readonly RepairerOpeningHoursRepository $repairerOpeningHoursRepository,
    ) {
    }

    /**
     * @param RepairerOpenings $constraint
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!$value instanceof RepairerOpeningHours) {
            throw new UnexpectedValueException($value, 'repairerOpeningHours');
        }

        if (!in_array($value->day, RepairerOpeningHours::DAYS_OF_WEEK, true)) {
            $this->context->buildViolation($constraint->messageNotValidDay)->addViolation();
        }

        if ($value->endTime < $value->startTime) {
            $this->context->buildViolation($constraint->messageNotValidTime)->addViolation();
        }

        if ($this->checkOverlappingHours($value)) {
            $this->context->buildViolation($constraint->messageHoursOverlapped)->addViolation();
        }
    }

    public function checkOverlappingHours(RepairerOpeningHours $value): bool
    {
        /** @var RepairerOpeningHours[] $rohs */
        $rohs = $this->repairerOpeningHoursRepository->findBy(
            [
                'repairer' => $value->repairer,
                'day' => $value->day,
            ]
        );

        foreach ($rohs as $roh) {
            if (($value->startTime < $roh->endTime && $value->startTime > $roh->startTime) || ($value->endTime < $roh->endTime && $value->endTime > $roh->startTime)) {
                return true;
            }
        }

        return false;
    }
}
