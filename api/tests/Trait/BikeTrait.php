<?php

declare(strict_types=1);

namespace App\Tests\Trait;

use App\Entity\Bike;
use App\Repository\BikeRepository;

trait BikeTrait
{
    protected BikeRepository $bikeRepository;

    public function getBike(): ?Bike
    {
        return $this->bikeRepository->findOneBy([]);
    }
}
