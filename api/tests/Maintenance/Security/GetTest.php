<?php

declare(strict_types=1);

namespace App\Tests\Maintenance\Security;

use App\Entity\Appointment;
use App\Entity\Maintenance;
use App\Entity\Repairer;
use App\Repository\AppointmentRepository;
use App\Repository\MaintenanceRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class GetTest extends AbstractTestCase
{
    /** @var Maintenance[] */
    protected array $maintenances = [];

    /** @var Repairer[] */
    protected array $repairers = [];

    protected Appointment $appointment;

    public function setUp(): void
    {
        parent::setUp();

        $this->maintenances = static::getContainer()->get(MaintenanceRepository::class)->findAll();
        $this->appointment = static::getContainer()->get(AppointmentRepository::class)->findOneBy([]);
    }

    public function testUserCanGetMaintenanceForOwnBikes(): void
    {
        $maintenance = $this->maintenances[0];
        $response = $this->createClientWithUser($maintenance->bike->owner)->request('GET', '/maintenances')->toArray();

        $this->assertResponseIsSuccessful();
    }

    public function testAdminCanGetMaintenanceCollection(): void
    {
        $response = $this->createClientAuthAsAdmin()->request('GET', '/maintenances')->toArray();

        $this->assertResponseIsSuccessful();
        // check that admin get all collection
        $this->assertSameSize($response['hydra:member'], $this->maintenances);

        // Check order filter by id

        $this->assertGreaterThan($response['hydra:member'][0]['id'], $response['hydra:member'][1]['id']);
    }

    public function testGetMaintenanceCollectionOrderByRepairDate(): void
    {
        $response = $this->createClientAuthAsAdmin()->request('GET', '/maintenances?order[repairDate]=desc&order[id]=asc')->toArray();

        $this->assertResponseIsSuccessful();
        // Check order filter by date
        $this->assertGreaterThanOrEqual($response['hydra:member'][1]['repairDate'], $response['hydra:member'][0]['repairDate']);
    }

    public function testUserCanGetOneMaintenance(): void
    {
        $maintenance = $this->maintenances[0];
        $this->createClientWithUser($maintenance->bike->owner)->request('GET', '/maintenances/'.$maintenance->id)->toArray();

        $this->assertResponseIsSuccessful();
    }

    public function testUserCannotGetMaintenanceForOthersBikes(): void
    {
        $maintenance = $this->maintenances[0];
        $otherMaintenance = $this->maintenances[1];
        $this->createClientWithUser($maintenance->bike->owner)->request('GET', '/maintenances/'.$otherMaintenance->id);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testUserCanGetMaintenanceFilterByBike(): void
    {
        $maintenance = $this->maintenances[0];
        $this->createClientWithUser($maintenance->bike->owner)->request('GET', '/maintenances?bike='.$maintenance->bike->id)->toArray();
        $this->assertResponseIsSuccessful();
    }

    public function testBossCanGetMaintenanceOfHisUser(): void
    {
        dd($this->appointment);
        $response = $this->createClientWithUser($appointment->repairer->owner)->request('GET', '/maintenances')->toArray();
        dd($response);
        $this->assertResponseIsSuccessful();
    }

}
