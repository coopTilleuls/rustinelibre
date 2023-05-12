<?php

declare(strict_types=1);

namespace App\Repairers\Validator;

use App\Entity\RepairerExceptionalClosure;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class RepairerClosingValidator extends ConstraintValidator
{
    /**
     * @param RepairerClosing $constraint
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!$value instanceof RepairerExceptionalClosure) {
            throw new UnexpectedValueException($value, 'repairerExceptionalClosure');
        }

        if ($value->startDate > $value->endDate) {
            $this->context->buildViolation($constraint->messageNotValidTime)->addViolation();
        }
    }
}
