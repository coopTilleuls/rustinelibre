<?php

declare(strict_types=1);

namespace App\Messages\Validator;

use App\Entity\DiscussionMessage;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;

class MessageDiscussionCheckValidator extends ConstraintValidator
{
    public function __construct(private readonly Security $security)
    {
    }

    /**
     * @param MessageDiscussionCheck $constraint
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!$value instanceof DiscussionMessage) {
            return;
        }

        /** @var User $currentUser */
        $currentUser = $this->security->getUser();
        $currentDiscussion = $value->discussion;

        // Current user is the cyclist of this conversation or an admin
        if ($currentDiscussion->customer->id === $currentUser->id || $this->security->isGranted('ROLE_ADMIN')) {
            return;
        }

        // Current user is the boss of this conversation's repairer shop
        if ($currentUser->repairer && $currentUser->repairer->id === $currentDiscussion->repairer->id) {
            return;
        }

        // Current user is an employee of this conversation's repairer shop
        if ($currentUser->repairerEmployee && $currentUser->repairerEmployee->repairer->id === $currentDiscussion->repairer->id) {
            return;
        }

        $this->context->buildViolation($constraint->message)->addViolation();
    }
}
