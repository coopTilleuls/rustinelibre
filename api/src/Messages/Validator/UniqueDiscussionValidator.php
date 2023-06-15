<?php

declare(strict_types=1);

namespace App\Messages\Validator;

use App\Entity\Discussion;
use App\Repository\DiscussionRepository;
use Symfony\Component\Validator\Constraint;
use Symfony\Component\Validator\ConstraintValidator;
use Symfony\Component\Validator\Exception\UnexpectedTypeException;

class UniqueDiscussionValidator extends ConstraintValidator
{
    public function __construct(
        private DiscussionRepository $discussionRepository,
    ) {
    }

    /**
     * @param Discussion $value
     */
    public function validate($value, Constraint $constraint): void
    {
        if (!$constraint instanceof UniqueDiscussion) {
            throw new UnexpectedTypeException($constraint, UniqueDiscussion::class);
        }

        if ($this->discussionRepository->findOneBy(['repairer' => $value->repairer, 'customer' => $value->customer])) {
            $this->context->buildViolation((string) $constraint->message)
                ->addViolation();
        }
    }
}
