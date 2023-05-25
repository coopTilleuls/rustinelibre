<?php

declare(strict_types=1);

namespace App\Tests\Maintenance\Security;

use App\Entity\Appointment;
use App\Entity\Bike;
use App\Entity\Maintenance;
use App\Entity\Repairer;
use App\Entity\User;
use App\Repository\AppointmentRepository;
use App\Repository\MaintenanceRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class GetTest extends AbstractTestCase
{
    /** @var [] */
    protected $maintenances = [];

    /** @var Repairer[] */
    protected array $repairers = [];

    protected Appointment $appointment;

    protected Bike $bike;

    protected User $owner;

    protected MaintenanceRepository $maintenanceRepository;

    protected Maintenance $userMaintenance;

    public function setUp(): void
    {
        parent::setUp();

        $this->maintenances = static::getContainer()->get(MaintenanceRepository::class)->findAll();
        $this->appointment = static::getContainer()->get(AppointmentRepository::class)->findOneBy([]);
        $this->maintenanceRepository = static::getContainer()->get(MaintenanceRepository::class);
        // According to the fixtures, maintenance of user with ROLE USER given
        $this->userMaintenance = $this->maintenanceRepository->findOneBy(['name' => 'User bike maintenance']);
        $this->owner = $this->userMaintenance->bike->owner;
    }

    public function testUserCanGetMaintenancesForOwnBikes(): void
    {
        $response = $this->createClientWithUser($this->owner)->request('GET', '/maintenances')->toArray();
        $this->assertResponseIsSuccessful();
        foreach ($response['hydra:member'] as $maintenanceResponse) {
            $maintenanceCheck = $this->maintenanceRepository->find($maintenanceResponse['id']);
            self::assertSame($maintenanceCheck->bike->owner->id, $this->userMaintenance->bike->owner->id);
        }
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
        $response = $this->createClientWithUser($this->owner)->request('GET', sprintf('/maintenances/%d', $this->userMaintenance->id))->toArray();

        $this->assertResponseIsSuccessful();
        $maintenanceCheck = $this->maintenanceRepository->find($response['id']);
        self::assertSame($maintenanceCheck->bike->owner->id, $this->userMaintenance->bike->owner->id);
    }

    public function testUserCannotGetMaintenanceForOthersBikes(): void
    {
        $otherMaintenance = $this->maintenances[0];
        $this->createClientWithUser($this->owner)->request('GET', sprintf('/maintenances/%d', $otherMaintenance->id));
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testUserCanGetMaintenanceFilterByBike(): void
    {
        $response = $this->createClientWithUser($this->owner)->request('GET', sprintf('/maintenances?bike=%d', $this->userMaintenance->bike->id))->toArray();
        $this->assertResponseIsSuccessful();

        foreach ($response['hydra:member'] as $maintenanceResponse) {
            $maintenanceCheck = $this->maintenanceRepository->find($maintenanceResponse['id']);
            self::assertSame($maintenanceCheck->bike->owner->id, $this->userMaintenance->bike->owner->id);
        }
    }

    public function testBossCanGetMaintenanceCollection(): void
    {
        $this->createClientWithUser($this->appointment->repairer->owner)->request('GET', '/maintenances');
        $this->assertResponseIsSuccessful();
    }

    public function testBossCanGetMaintenanceOfAnUser(): void
    {
        $this->createClientWithUser($this->appointment->repairer->owner)->request('GET', sprintf('/maintenances?bike=%d', $this->userMaintenance->bike->id));
        $this->assertResponseIsSuccessful();
    }
}
