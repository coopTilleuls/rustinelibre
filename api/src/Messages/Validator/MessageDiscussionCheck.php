<?php

declare(strict_types=1);

namespace App\Messages\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class MessageDiscussionCheck extends Constraint
{
    public string $message = 'Your are not participating to this discussion';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
