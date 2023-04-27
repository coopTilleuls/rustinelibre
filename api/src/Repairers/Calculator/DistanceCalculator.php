<?php

declare(strict_types=1);

namespace App\Repairers\Calculator;

final class DistanceCalculator
{
    public function distanceBetween2Coordinates(float $latitudeFrom, float $longitudeFrom, float $latitudeTo, float $longitudeTo): int
    {
        $latFrom = deg2rad($latitudeFrom);
        $lonFrom = deg2rad($longitudeFrom);
        $latTo = deg2rad($latitudeTo);
        $lonTo = deg2rad($longitudeTo);

        $latDelta = $latTo - $latFrom;
        $lonDelta = $lonTo - $lonFrom;

        $angle = 2 * asin(sqrt(pow(sin($latDelta / 2), 2) +
                cos($latFrom) * cos($latTo) * pow(sin($lonDelta / 2), 2)));

        return (int) ($angle * 6371000);
    }
}
