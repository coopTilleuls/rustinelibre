<?php

declare(strict_types=1);

namespace App\Messages\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class UniqueDiscussion extends Constraint
{
    public string $message = 'discussion.unique';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
