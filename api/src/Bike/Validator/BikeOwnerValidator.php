<?php

declare(strict_types=1);

namespace App\Bike\Validator;

use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

final class BikeOwnerValidator extends ConstraintValidator
{
    public function __construct(private Security $security)
    {
    }

    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof BikeOwner) {
            throw new UnexpectedTypeException($constraint, BikeOwner::class);
        }

        /** @var User|null $currentUser */
        $currentUser = $this->security->getUser();

        if (($currentUser && ($currentUser->isAdmin() || $currentUser->isBoss() || $currentUser->isEmployee())) || !$value) {
            return;
        }

        if (!$currentUser || $value->owner->id !== $currentUser->id) {
            $this->context->buildViolation((string) $constraint->message)
                ->addViolation();
        }
    }
}
