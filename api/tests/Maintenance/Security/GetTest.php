<?php

declare(strict_types=1);

namespace App\Tests\Maintenance\Security;

use App\Entity\Bike;
use App\Entity\Maintenance;
use App\Repository\BikeRepository;
use App\Repository\MaintenanceRepository;
use App\Tests\AbstractTestCase;

class GetTest extends AbstractTestCase
{
    /** @var Bike[] */
    protected array $bikes = [];

    /** @var Maintenance[] */
    protected array $maintenances = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->bikes = static::getContainer()->get(BikeRepository::class)->findAll();
        $this->maintenances = static::getContainer()->get(MaintenanceRepository::class)->findAll();

    }
    public function testUserCanGetMaintenanceForOwnBikes(): void
    {
        $maintenance = $this->maintenances[0];
        $response = $this->createClientWithUser($maintenance->bike->owner)->request('GET', '/maintenances')->toArray();

        dd($response);
        $this->assertResponseIsSuccessful();
    }
    public function testUserCanGetOneMaintenance(): void
    {
        $maintenance = $this->maintenances[0];
        $this->createClientWithUser($maintenance->bike->owner)->request('GET', '/maintenances/'.$maintenance->id)->toArray();

        $this->assertResponseIsSuccessful();
    }
}
