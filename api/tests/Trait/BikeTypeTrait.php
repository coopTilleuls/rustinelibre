<?php

declare(strict_types=1);

namespace App\Tests\Trait;

use App\Entity\BikeType;
use App\Repository\BikeTypeRepository;

trait BikeTypeTrait
{
    protected BikeTypeRepository $bikeTypeRepository;

    public function getBikeType(): BikeType
    {
        $bikeType = $this->bikeTypeRepository->findOneBy([]);

        if (null === $bikeType) {
            $bikeType = new BikeType();
            $bikeType->name = 'Vélo de course';
            $this->bikeTypeRepository->save($bikeType, true);
        }

        return $bikeType;
    }
}
