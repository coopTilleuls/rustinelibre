<?php

declare(strict_types=1);

namespace App\Repairers\Validator;

use App\Entity\Repairer;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedValueException;

class RepairerSlotsValidator extends ConstraintValidator
{
    /**
     * @param RepairerSlots $constraint
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!$value instanceof Repairer) {
            throw new UnexpectedValueException($value, 'repairer');
        }

        if ($value->durationSlot && !in_array($value->durationSlot, [30, 60, 90])) {
            $this->context->buildViolation($constraint->messageNotValidDurationSlot)->addViolation();
        }
    }
}
