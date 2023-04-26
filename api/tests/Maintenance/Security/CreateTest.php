<?php

declare(strict_types=1);

namespace App\Tests\Maintenance\Security;


use App\Entity\Bike;
use App\Entity\Maintenance;
use App\Entity\User;
use App\Repository\BikeRepository;
use App\Repository\MaintenanceRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class CreateTest extends AbstractTestCase
{
    /** @var Bike[] */
    protected array $bikes = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->bikes = static::getContainer()->get(BikeRepository::class)->findAll();

    }
    public function testUserCanCreateMaintenanceForOwnBike(): void
    {
        $bike = $this->bikes[0];

        $this->createClientWithUser($bike->owner)->request('POST', '/maintenances',[
        'headers' => ['Content-Type' => 'application/json'],
        'json' => [
            'name' => 'Test',
            'description' => 'test description',
            'bike' => sprintf('/bikes/%d',$bike->id)
            ]
            ]);

        $this->assertResponseIsSuccessful();
    }

    public function testUserCanCreateMaintenanceForOtherBike(): void
    {
        $bike = $this->bikes[0];
        $this->createClientAuthAsUser()->request('POST', '/maintenances',[
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Test',
                'description' => 'test description',
                'bike' => sprintf('/bikes/%d',$bike->id)
            ]
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'The bike should be your bike to add maintenance',
        ]);
    }
}