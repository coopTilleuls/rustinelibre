<?php

declare(strict_types=1);

namespace App\Tests\Bike;

use App\Entity\Bike;
use App\Entity\BikeType;
use App\Repository\BikeRepository;
use App\Repository\BikeTypeRepository;
use App\Tests\AbstractTestCase;

class SecurityBikeTest extends AbstractTestCase
{
    /** @var BikeType[] */
    private array $bikeTypes = [];

    /** @var Bike[] */
    private array $bikes = [];

    public function setUp(): void
    {
        parent::setUp();
        $this->bikes = static::getContainer()->get(BikeRepository::class)->findAll();
        $this->bikeTypes = static::getContainer()->get(BikeTypeRepository::class)->findAll();
    }

    public function testCreateBikeWithUser(): void
    {
        $this->createClientAuthAsUser()->request('POST', '/bikes', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'brand' => 'Test',
                'bikeType' => sprintf('/bike_types/%d', $this->bikeTypes[0]->id),
                'name' => 'Test',
                'description' => 'Test',
            ]
        ]);
        self::assertResponseStatusCodeSame(201);
    }

    public function testCreateBikeWithUnauthenticated(): void
    {
        self::createClient()->request('POST', '/bikes', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'brand' => 'Test',
                'bikeType' => sprintf('/bike_types/%d', $this->bikeTypes[0]->id),
                'name' => 'Test',
                'description' => 'Test',
            ]
        ]);
        self::assertResponseStatusCodeSame(401);
    }

    public function testUserCanUpdateHisBike(): void
    {
        $bike = $this->bikes[0];
        $this->createClientWithUser($bike->owner)->request('PUT', sprintf('/bikes/%d', $bike->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'brand' => 'Test',
                'bikeType' => sprintf('/bike_types/%d', $this->bikeTypes[0]->id),
                'name' => 'Test',
                'description' => 'Test',
            ]
        ]);
        self::assertResponseStatusCodeSame(200);
    }

    public function testAdminCanUpdateBike(): void
    {
        $bike = $this->bikes[0];
        $this->createClientAuthAsAdmin()->request('PUT', sprintf('/bikes/%d', $bike->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'brand' => 'Test',
                'bikeType' => sprintf('/bike_types/%d', $this->bikeTypes[0]->id),
                'name' => 'Test',
                'description' => 'Test',
            ]
        ]);
        self::assertResponseStatusCodeSame(200);
    }

    public function testUserCannotUpdateOtherBike(): void
    {
        $bike = $this->bikes[0];
        $this->createClientAuthAsUser()->request('PUT', sprintf('/bikes/%d', $bike->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'brand' => 'Test',
                'bikeType' => sprintf('/bike_types/%d', $this->bikeTypes[0]->id),
                'name' => 'Test',
                'description' => 'Test',
            ]
        ]);
        self::assertResponseStatusCodeSame(403);
    }

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

}