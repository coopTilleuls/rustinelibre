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

    public static function dateTimeImmutableBetweenThreeYearsAgoAndNow(): \DateTimeImmutable
    {
        $today = new \DateTimeImmutable();
        $threeYearsAgo = $today->sub(new \DateInterval('P3Y'));
        $diffInSeconds = $today->getTimestamp() - $threeYearsAgo->getTimestamp();
        $randomSeconds = rand(0, $diffInSeconds);

        return $threeYearsAgo->add(new \DateInterval('PT'.$randomSeconds.'S'));
    }
}
