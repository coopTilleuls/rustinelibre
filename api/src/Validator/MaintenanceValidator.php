<?php

declare(strict_types=1);

namespace App\Validator;

use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;
use Symfony\Bundle\SecurityBundle\Security;

final class MaintenanceValidator extends ConstraintValidator
{
    public function __construct(private RequestStack $requestStack, private Security $security)
    {

    }
    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof Maintenance) {
            throw new UnexpectedTypeException($constraint, Maintenance::class);
        }
        $currentRequest = $this->requestStack->getCurrentRequest();
        if ($currentRequest && ('POST' !== $currentRequest->getMethod())) {
            return;
        }

        $bikeOwner = $value->owner;
        if($bikeOwner !== $this->security->getUser()) {
            $this->context->buildViolation((string) $constraint->message)
                ->addViolation();
        }
    }
}
