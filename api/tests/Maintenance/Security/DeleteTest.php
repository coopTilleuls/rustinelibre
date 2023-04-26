<?php

declare(strict_types=1);

namespace App\Tests\Maintenance\Security;

use App\Entity\Bike;
use App\Repository\BikeRepository;
use App\Repository\MaintenanceRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class DeleteTest extends AbstractTestCase
{
    /** @var Bike[] */
    protected array $bikes = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->bikes = static::getContainer()->get(BikeRepository::class)->findAll();

    }
    public function testUserCanDeleteMaintenanceForOwnBike(): void
    {
        $bike = $this->bikes[0];
        $maintenance = static::getContainer()->get(MaintenanceRepository::class)->findOneBy(['bike' => $bike->id]);

        $this->createClientWithUser($bike->owner)->request('DELETE', '/maintenances/'.$maintenance->id);

        $this->assertResponseIsSuccessful();
    }

    public function testAdminCanDeleteMaintenanceForUserBike(): void
    {
        $bike = $this->bikes[0];
        $maintenance = static::getContainer()->get(MaintenanceRepository::class)->findOneBy(['bike' => $bike->id]);

        $this->createClientAuthAsAdmin()->request('DELETE', '/maintenances/'.$maintenance->id);

        $this->assertResponseIsSuccessful();
    }

   public function testUserCannotDeleteMaintenanceForOtherBike(): void
    {
        $bike = $this->bikes[0];
        $maintenance = static::getContainer()->get(MaintenanceRepository::class)->findOneBy(['bike' => $bike->id]);

        $this->createClientAuthAsUser()->request('DELETE', '/maintenances/'.$maintenance->id);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
