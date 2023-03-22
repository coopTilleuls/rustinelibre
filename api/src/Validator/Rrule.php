<?php

declare(strict_types=1);

namespace App\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
final class Rrule extends Constraint
{
    public string $message = 'The string "{{ value }}" is not a valid iCalendar recurrence rule (RFC 5545).';

    public string $mode = 'strict';
}
