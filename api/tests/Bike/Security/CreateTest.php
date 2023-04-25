<?php

declare(strict_types=1);

namespace App\Tests\Bike\Security;

use App\Tests\Bike\BikeAbstractTestCase;

class CreateTest extends BikeAbstractTestCase
{
    public function testCreateBikeWithUser(): void
    {
        $pictureId = $this->addMedia();
        $wheelPictureId = $this->addMedia();
        $transmissionPictureId = $this->addMedia();

        $this->createClientAuthAsUser()->request('POST', '/bikes', [
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
        self::assertResponseStatusCodeSame(201);
    }

    public function testCreateBikeWithUnauthenticated(): void
    {
        $pictureId = $this->addMedia();
        $wheelPictureId = $this->addMedia();
        $transmissionPictureId = $this->addMedia();

        self::createClient()->request('POST', '/bikes', [
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
        self::assertResponseStatusCodeSame(401);
    }
}
