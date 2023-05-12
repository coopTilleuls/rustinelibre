<?php

declare(strict_types=1);

namespace App\Repairers\Validator;

use App\Entity\RepairerOpeningHours;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class RepairerOpeningsValidator extends ConstraintValidator
{
    /**
     * @param RepairerOpenings $constraint
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!$value instanceof RepairerOpeningHours) {
            throw new UnexpectedValueException($value, 'repairerOpeningHours');
        }

        if (!in_array($value->day, RepairerOpeningHours::DAYS_OF_WEEK)) {
            $this->context->buildViolation($constraint->messageNotValidDay)->addViolation();
        }

        if ($value->endTime < $value->startTime) {
            $this->context->buildViolation($constraint->messageNotValidTime)->addViolation();
        }
    }
}
