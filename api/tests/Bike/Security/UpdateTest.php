<?php

declare(strict_types=1);

namespace App\Tests\Bike\Security;

use App\Repository\BikeRepository;
use App\Repository\BikeTypeRepository;
use App\Repository\MediaObjectRepository;
use App\Tests\AbstractTestCase;
use App\Tests\Trait\BikeTrait;
use App\Tests\Trait\BikeTypeTrait;
use App\Tests\Trait\MediaTrait;

class UpdateTest extends AbstractTestCase
{
    use BikeTrait;
    use MediaTrait;
    use BikeTypeTrait;

    public function setUp(): void
    {
        parent::setUp();
        $this->bikeTypeRepository = self::getContainer()->get(BikeTypeRepository::class);
        $this->bikeRepository = self::getContainer()->get(BikeRepository::class);
        $this->mediaRepository = self::getContainer()->get(MediaObjectRepository::class);
    }

    public function testUserCanUpdateHisBike(): void
    {
        $media = $this->getMedia();
        $bike = $this->getBike();
        $bikeType = $this->getBikeType();

        $this->createClientWithUser($bike->owner)->request('PUT', sprintf('/bikes/%d', $bike->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'brand' => 'Test',
                'bikeType' => sprintf('/bike_types/%d', $bikeType->id),
                'name' => 'Test',
                'description' => 'Test',
                'picture' => sprintf('/media_objects/%s', $media->id),
                'wheelPicture' => sprintf('/media_objects/%s', $media->id),
                'transmissionPicture' => sprintf('/media_objects/%s', $media->id),
            ],
        ]);
        self::assertResponseStatusCodeSame(200);
    }

    public function testAdminCanUpdateBike(): void
    {
        $media = $this->getMedia();
        $bike = $this->getBike();
        $bikeType = $this->getBikeType();

        $this->createClientAuthAsAdmin()->request('PUT', sprintf('/bikes/%d', $bike->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'brand' => 'Test',
                'bikeType' => sprintf('/bike_types/%d', $bikeType->id),
                'name' => 'Test',
                'description' => 'Test',
                'picture' => sprintf('/media_objects/%s', $media->id),
                'wheelPicture' => sprintf('/media_objects/%s', $media->id),
                'transmissionPicture' => sprintf('/media_objects/%s', $media->id),
            ],
        ]);
        self::assertResponseStatusCodeSame(200);
    }

    public function testUserCannotUpdateOtherBike(): void
    {
        $media = $this->getMedia();
        $bike = $this->getBike();
        $bikeType = $this->getBikeType();

        $this->createClientAuthAsUser()->request('PUT', sprintf('/bikes/%d', $bike->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'brand' => 'Test',
                'bikeType' => sprintf('/bike_types/%d', $bikeType->id),
                'name' => 'Test',
                'description' => 'Test',
                'picture' => sprintf('/media_objects/%s', $media->id),
                'wheelPicture' => sprintf('/media_objects/%s', $media->id),
                'transmissionPicture' => sprintf('/media_objects/%s', $media->id),
            ],
        ]);
        self::assertResponseStatusCodeSame(403);
    }
}
