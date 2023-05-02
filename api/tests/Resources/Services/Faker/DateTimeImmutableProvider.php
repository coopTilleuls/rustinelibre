<?php

declare(strict_types=1);

namespace App\Tests\Resources\Services\Faker;

use Faker\Generator;
use Faker\Provider\Base;

final class DateTimeImmutableProvider extends Base
{
    public function __construct(Generator $generator)
    {
        parent::__construct($generator);
    }

    public static function dateTimeImmutableBetweenGivenPastIntervalAndNow($interval): \DateTimeImmutable
    {
        $today = new \DateTimeImmutable();
        $dateInterval = \DateInterval::createFromDateString($interval);
        $timeAgo = $today->sub($dateInterval);
        $diffInSeconds = $today->getTimestamp() - $timeAgo->getTimestamp();
        $randomSeconds = rand(0, $diffInSeconds);

        return $timeAgo->add(new \DateInterval('PT'.$randomSeconds.'S'));
    }
}
