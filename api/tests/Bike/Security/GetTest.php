<?php

declare(strict_types=1);

namespace App\Tests\Bike\Security;

use App\Repository\BikeRepository;
use App\Tests\AbstractTestCase;
use App\Tests\Trait\BikeTrait;

class GetTest extends AbstractTestCase
{
    use BikeTrait;

    public function setUp(): void
    {
        parent::setUp();
        $this->bikeRepository = self::getContainer()->get(BikeRepository::class);
    }

    public function testAdminCanGetBike(): void
    {
        $bike = $this->getBike();
        $response = $this->createClientAuthAsAdmin()->request('GET', sprintf('/bikes/%d', $bike->id))->toArray();
        self::assertResponseStatusCodeSame(200);
        self::assertArrayHasKey('id', $response);
        self::assertArrayHasKey('owner', $response);
        self::assertArrayHasKey('brand', $response);
        self::assertArrayHasKey('bikeType', $response);
        self::assertArrayHasKey('name', $response);
        self::assertArrayHasKey('description', $response);
    }

    public function testOwnerCanGetHisBike(): void
    {
        $bike = $this->getBike();
        $this->createClientWithUser($bike->owner)->request('GET', sprintf('/bikes/%d', $bike->id));
        self::assertResponseStatusCodeSame(200);
    }

    public function testUserCannotGetOtherBike(): void
    {
        $bike = $this->getBike();
        $this->createClientAuthAsUser()->request('GET', sprintf('/bikes/%d', $bike->id));
        self::assertResponseStatusCodeSame(403);
    }

    public function testOwnerGetCollectionOfHisBikes(): void
    {
        $bike = $this->getBike();
        $response = $this->createClientWithUser($bike->owner)->request('GET', '/bikes')->toArray();

        self::assertResponseStatusCodeSame(200);
        self::assertArrayHasKey('hydra:member', $response);
        self::assertArrayHasKey('hydra:totalItems', $response);

        foreach ($response['hydra:member'] as $bikeResponse) {
            self::assertArrayHasKey('id', $bikeResponse);
            self::assertArrayHasKey('owner', $bikeResponse);
            self::assertSame(sprintf('/users/%d', $bike->owner->id), $bikeResponse['owner']);
            self::assertArrayHasKey('brand', $bikeResponse);
            self::assertArrayHasKey('bikeType', $bikeResponse);
            self::assertArrayHasKey('name', $bikeResponse);
            self::assertArrayHasKey('description', $bikeResponse);
        }
    }

    public function testAdminGetCollectionOfBikes(): void
    {
        $response = $this->createClientAuthAsAdmin()->request('GET', '/bikes')->toArray();

        self::assertResponseStatusCodeSame(200);
        self::assertArrayHasKey('hydra:member', $response);
        self::assertArrayHasKey('hydra:totalItems', $response);

        $owners = [];
        foreach ($response['hydra:member'] as $bikeResponse) {
            self::assertArrayHasKey('id', $bikeResponse);
            self::assertArrayHasKey('owner', $bikeResponse);
            $owners[] = $bikeResponse['owner'];
            self::assertArrayHasKey('brand', $bikeResponse);
            self::assertArrayHasKey('bikeType', $bikeResponse);
            self::assertArrayHasKey('name', $bikeResponse);
            self::assertArrayHasKey('description', $bikeResponse);
        }

        // Check that all bikes are not from the same owner
        self::assertGreaterThan(1, count(array_unique($owners)));
    }
}
