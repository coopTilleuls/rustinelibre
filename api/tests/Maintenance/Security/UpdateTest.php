<?php

declare(strict_types=1);

namespace App\Tests\Maintenance\Security;

use App\Entity\Bike;
use App\Repository\BikeRepository;
use App\Repository\MaintenanceRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class UpdateTest extends AbstractTestCase
{
    /** @var Bike[] */
    protected array $bikes = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->bikes = static::getContainer()->get(BikeRepository::class)->findAll();

    }
    public function testUserCanUpdateMaintenanceForOwnBike(): void
    {
        $bike = $this->bikes[0];
        $maintenance = static::getContainer()->get(MaintenanceRepository::class)->findOneBy(['bike' => $bike->id]);

        $this->createClientWithUser($bike->owner)->request('PUT', '/maintenances/'.$maintenance->id,[
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'put name',
                'description' => 'put description',
                'bike' => sprintf('/bikes/%d',$bike->id)
            ]
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testAdminCanUpdateMaintenanceForOwnBike(): void
    {
        $bike = $this->bikes[0];
        $maintenance = static::getContainer()->get(MaintenanceRepository::class)->findOneBy(['bike' => $bike->id]);

        $this->createClientAuthAsAdmin()->request('PUT', '/maintenances/'.$maintenance->id,[
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'put by admin name',
                'description' => 'put description',
                'bike' => sprintf('/bikes/%d',$bike->id)
            ]
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testUserCannotUpdateMaintenanceForOtherBike(): void
    {
        $bike = $this->bikes[0];
        $maintenance = static::getContainer()->get(MaintenanceRepository::class)->findOneBy(['bike' => $bike->id]);
        $this->createClientAuthAsUser()->request('PUT', '/maintenances/'.$maintenance->id,[
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'put name',
                'description' => 'put description',
                'bike' => sprintf('/bikes/%d',$bike->id)
            ]
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

}