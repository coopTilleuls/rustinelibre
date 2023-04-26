<?php

declare(strict_types=1);

namespace App\Tests\Bike\Security;

use App\Repository\BikeRepository;
use App\Repository\MediaObjectRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use App\Tests\Trait\BikeTrait;
use App\Tests\Trait\MediaTrait;

class DeleteTest extends AbstractTestCase
{
    use MediaTrait;
    use BikeTrait;

    private UserRepository $userRepository;

    protected $em;

    public function setUp(): void
    {
        parent::setUp();
        $this->mediaRepository = self::getContainer()->get(MediaObjectRepository::class);
        $this->bikeRepository = self::getContainer()->get(BikeRepository::class);
        $this->userRepository = self::getContainer()->get(UserRepository::class);
        $this->em = self::getContainer()->get('doctrine')->getManager();
    }

    public function testUserCanDeleteHisBike(): void
    {
        $bike = $this->getBike();

        $this->createClientWithUser($bike->owner)->request('DELETE', sprintf('/bikes/%d', $bike->id));
        self::assertResponseStatusCodeSame(204);
    }

    public function testAdminCanDeleteBike(): void
    {
        $bike = $this->getBike();
        $this->createClientAuthAsAdmin()->request('DELETE', sprintf('/bikes/%d', $bike->id));
        self::assertResponseStatusCodeSame(204);
    }

    public function testUserCannotDeleteOtherBike(): void
    {
        $bike = $this->getBike();
        $this->createClientAuthAsUser()->request('DELETE', sprintf('/bikes/%d', $bike->id));
        self::assertResponseStatusCodeSame(403);
    }

    public function testBikeIsRemovedWhenRemoveOwner(): void
    {
        $bike = $this->getBike();
        $id = $bike->id;
        $this->userRepository->remove($bike->owner, true);
        self::assertNull($this->bikeRepository->find($id));
    }

    public function testPictureIsSetNullWhenMediaObjectIsRemoved(): void
    {
        $bike = $this->getBike();
        $media = $this->getMedia();
        $bike->picture = $media;
        $this->bikeRepository->save($bike, true);
        $this->mediaRepository->remove($media, true);
        $this->em->refresh($bike);
        self::assertNull($this->bikeRepository->find($bike->id)->picture);
    }

    public function testWheelPictureIsSetNullWhenMediaObjectIsRemoved(): void
    {
        $bike = $this->getBike();
        $media = $this->getMedia();
        $bike->wheelPicture = $media;
        $this->bikeRepository->save($bike, true);
        $this->mediaRepository->remove($media, true);
        $this->em->refresh($bike);
        self::assertNull($this->bikeRepository->find($bike->id)->wheelPicture);
    }

    public function testTransmissionPictureIsSetNullWhenMediaObjectIsRemoved(): void
    {
        $bike = $this->getBike();
        $media = $this->getMedia();
        $bike->transmissionPicture = $media;
        $this->bikeRepository->save($bike, true);
        $this->mediaRepository->remove($media, true);
        $this->em->refresh($bike);
        self::assertNull($bike->transmissionPicture);
    }
}
