<?php

declare(strict_types=1);

namespace App\Tests\Bike\Security;

use App\Tests\Bike\BikeAbstractTestCase;

class DeleteTest extends BikeAbstractTestCase
{
    public function testUserCanDeleteHisBike(): void
    {
        $bike = $this->bikes[0];

        $this->createClientWithUser($bike->owner)->request('DELETE', sprintf('/bikes/%d', $bike->id));
        self::assertResponseStatusCodeSame(204);
    }

    public function testAdminCanDeleteBike(): void
    {
        $bike = $this->bikes[0];
        $this->createClientAuthAsAdmin()->request('DELETE', sprintf('/bikes/%d', $bike->id));
        self::assertResponseStatusCodeSame(204);
    }

    public function testUserCannotDeleteOtherBike(): void
    {
        $bike = $this->bikes[0];
        $this->createClientAuthAsUser()->request('DELETE', sprintf('/bikes/%d', $bike->id));
        self::assertResponseStatusCodeSame(403);
    }

    public function testBikeIsRemovedWhenRemoveOwner(): void
    {
        $bike = $this->bikes[0];

        $response = $this->createClientAuthAsAdmin()->request('DELETE', sprintf('/users/%d', $bike->owner->id));
        if (204 !== $response->getStatusCode()) {
            self::fail('User is not removed');
        }
        self::assertNull($this->bikeRepository->find($bike->id));
    }

    public function testPictureIsSetNullWhenMediaObjectIsRemoved(): void
    {
        $bike = $this->bikes[0];
        $pictureId = $this->addMedia();
        $picture = $this->mediaObjectRepository->find($pictureId);
        $bike->picture = $picture;
        $this->bikeRepository->save($bike);

        $response = $this->adminClient->request('DELETE', sprintf('/media_objects/%d', $bike->picture->id));
        if (204 !== $response->getStatusCode()) {
            self::fail('Media object is not removed');
        }
        self::assertNull($this->bikeRepository->find($bike->id)->picture);
    }

    public function testWheelPictureIsSetNullWhenMediaObjectIsRemoved(): void
    {
        $bike = $this->bikes[0];
        $wheelPictureId = $this->addMedia();
        $wheelPicture = $this->mediaObjectRepository->find($wheelPictureId);
        $bike->wheelPicture = $wheelPicture;
        $this->bikeRepository->save($bike);

        $response = $this->adminClient->request('DELETE', sprintf('/media_objects/%d', $bike->wheelPicture->id));
        if (204 !== $response->getStatusCode()) {
            self::fail('Media object is not removed');
        }
        self::assertNull($this->bikeRepository->find($bike->id)->wheelPicture);
    }

    public function testTransmissionPictureIsSetNullWhenMediaObjectIsRemoved(): void
    {
        $bike = $this->bikes[0];
        $transmissionPictureId = $this->addMedia();
        $transmissionPicture = $this->mediaObjectRepository->find($transmissionPictureId);
        $bike->transmissionPicture = $transmissionPicture;
        $this->bikeRepository->save($bike);

        $response = $this->adminClient->request('DELETE', sprintf('/media_objects/%d', $bike->transmissionPicture->id));
        if (204 !== $response->getStatusCode()) {
            self::fail('Media object is not removed');
        }
        self::assertNull($this->bikeRepository->find($bike->id)->transmissionPicture);
    }
}
