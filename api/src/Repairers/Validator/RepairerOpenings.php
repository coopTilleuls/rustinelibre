<?php

declare(strict_types=1);

namespace App\Repairers\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class RepairerOpenings extends Constraint
{
    public string $messageNotValidDay = 'This day is not available, should be one of : monday, tuesday, wednesday, thursday, friday, saturday, sunday';
    public string $messageNotValidTime = 'The endTime cannot be before startTime';
    public string $messageHoursOverlapped = 'The hours are overlapped';

    public function getTargets(): string
    {
        return self::CLASS_CONSTRAINT;
    }
}
