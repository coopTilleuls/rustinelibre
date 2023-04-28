<?php

declare(strict_types=1);

namespace App\Tests\Maintenance\Security;

use App\Entity\Maintenance;
use App\Repository\MaintenanceRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class DeleteTest extends AbstractTestCase
{
    /** @var Maintenance[] */
    protected array $maintenances = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->maintenances = static::getContainer()->get(MaintenanceRepository::class)->findAll();
    }

    public function testUserCanDeleteMaintenanceForOwnBike(): void
    {
        $maintenance = $this->maintenances[0];

        $this->createClientWithUser($maintenance->bike->owner)->request('DELETE', sprintf('/maintenances/%d', $maintenance->id));

        $this->assertResponseIsSuccessful();
    }

    public function testAdminCanDeleteMaintenanceForUserBike(): void
    {
        $maintenance = $this->maintenances[0];

        $this->createClientAuthAsAdmin()->request('DELETE', sprintf('/maintenances/%d', $maintenance->id));

        $this->assertResponseIsSuccessful();
    }

   public function testUserCannotDeleteMaintenanceForOtherBike(): void
   {
       $maintenance = $this->maintenances[0];

       $this->createClientAuthAsUser()->request('DELETE', sprintf('/maintenances/%d', $maintenance->id));
       $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
   }
}
