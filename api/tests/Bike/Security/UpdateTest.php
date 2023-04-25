<?php

declare(strict_types=1);

namespace App\Tests\Bike\Security;

use App\Tests\Bike\BikeAbstractTestCase;

class UpdateTest extends BikeAbstractTestCase
{
    public function testUserCanUpdateHisBike(): void
    {
        $pictureId = $this->addMedia();
        $wheelPictureId = $this->addMedia();
        $transmissionPictureId = $this->addMedia();
        $bike = $this->bikes[0];

        $this->createClientWithUser($bike->owner)->request('PUT', sprintf('/bikes/%d', $bike->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'brand' => 'Test',
                'bikeType' => sprintf('/bike_types/%d', $this->bikeTypes[0]->id),
                'name' => 'Test',
                'description' => 'Test',
                'picture' => sprintf('/media_objects/%s', $pictureId),
                'wheelPicture' => sprintf('/media_objects/%s', $wheelPictureId),
                'transmissionPicture' => sprintf('/media_objects/%s', $transmissionPictureId),
            ],
        ]);
        self::assertResponseStatusCodeSame(200);
    }

    public function testAdminCanUpdateBike(): void
    {
        $pictureId = $this->addMedia();
        $wheelPictureId = $this->addMedia();
        $transmissionPictureId = $this->addMedia();
        $bike = $this->bikes[0];

        $this->createClientAuthAsAdmin()->request('PUT', sprintf('/bikes/%d', $bike->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'brand' => 'Test',
                'bikeType' => sprintf('/bike_types/%d', $this->bikeTypes[0]->id),
                'name' => 'Test',
                'description' => 'Test',
                'picture' => sprintf('/media_objects/%s', $pictureId),
                'wheelPicture' => sprintf('/media_objects/%s', $wheelPictureId),
                'transmissionPicture' => sprintf('/media_objects/%s', $transmissionPictureId),
            ],
        ]);
        self::assertResponseStatusCodeSame(200);
    }

    public function testUserCannotUpdateOtherBike(): void
    {
        $pictureId = $this->addMedia();
        $wheelPictureId = $this->addMedia();
        $transmissionPictureId = $this->addMedia();
        $bike = $this->bikes[0];

        $this->createClientAuthAsUser()->request('PUT', sprintf('/bikes/%d', $bike->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'brand' => 'Test',
                'bikeType' => sprintf('/bike_types/%d', $this->bikeTypes[0]->id),
                'name' => 'Test',
                'description' => 'Test',
                'picture' => sprintf('/media_objects/%s', $pictureId),
                'wheelPicture' => sprintf('/media_objects/%s', $wheelPictureId),
                'transmissionPicture' => sprintf('/media_objects/%s', $transmissionPictureId),
            ],
        ]);
        self::assertResponseStatusCodeSame(403);
    }
}
