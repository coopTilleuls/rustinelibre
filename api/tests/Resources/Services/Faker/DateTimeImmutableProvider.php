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

    public static function dateTimeImmutableFromInterval(string $intervalStr): \DateTimeImmutable
    {
        $today = new \DateTimeImmutable();
        $interval = \DateInterval::createFromDateString($intervalStr);
        if (str_starts_with($intervalStr, '-')) {
            $futureDateTime = $today->sub($interval);
        } else {
            $futureDateTime = $today->add($interval);
        }
        $diffInSeconds = abs($today->getTimestamp() - $futureDateTime->getTimestamp());
        $randomSeconds = rand(0, $diffInSeconds);

        return $futureDateTime->add(new \DateInterval('PT'.$randomSeconds.'S'));
    }
}
