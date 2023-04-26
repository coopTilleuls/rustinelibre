<?php

declare(strict_types=1);

namespace App\Tests\Bike\Security;

use App\Repository\BikeTypeRepository;
use App\Repository\MediaObjectRepository;
use App\Tests\AbstractTestCase;
use App\Tests\Trait\BikeTypeTrait;
use App\Tests\Trait\MediaTrait;

class CreateTest extends AbstractTestCase
{
    use MediaTrait;
    use BikeTypeTrait;

    public function setUp(): void
    {
        parent::setUp();
        $this->mediaRepository = self::getContainer()->get(MediaObjectRepository::class);
        $this->bikeTypeRepository = self::getContainer()->get(BikeTypeRepository::class);
    }

    public function testCreateBikeWithUser(): void
    {
        $media = $this->getMedia();
        $bikeType = $this->getBikeType();

        $this->createClientAuthAsUser()->request('POST', '/bikes', [
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
        self::assertResponseStatusCodeSame(201);
    }

    public function testCreateBikeWithUnauthenticated(): void
    {
        $media = $this->getMedia();
        $bikeType = $this->getBikeType();

        self::createClient()->request('POST', '/bikes', [
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
        self::assertResponseStatusCodeSame(401);
    }
}
