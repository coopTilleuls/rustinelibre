<?php

declare(strict_types=1);

namespace App\Discussion\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class UniqueDiscussion extends Constraint
{
    public string $message = 'Cannot create two discussions for the same repairer and customer';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
