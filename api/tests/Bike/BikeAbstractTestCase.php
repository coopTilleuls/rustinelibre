<?php

declare(strict_types=1);

namespace App\Tests\Bike;

use App\Entity\Bike;
use App\Entity\BikeType;
use App\Repository\BikeRepository;
use App\Repository\BikeTypeRepository;
use App\Repository\MediaObjectRepository;
use App\Tests\AbstractTestCase;

class BikeAbstractTestCase extends AbstractTestCase
{
    /** @var BikeType[] */
    protected array $bikeTypes = [];

    /** @var Bike[] */
    protected array $bikes = [];

    protected BikeRepository $bikeRepository;

    protected MediaObjectRepository $mediaObjectRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->mediaObjectRepository = static::getContainer()->get(MediaObjectRepository::class);
        $this->bikeRepository = static::getContainer()->get(BikeRepository::class);
        $this->bikes = $this->bikeRepository->findAll();
        $this->bikeTypes = static::getContainer()->get(BikeTypeRepository::class)->findAll();
    }
}
