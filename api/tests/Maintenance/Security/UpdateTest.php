<?php

declare(strict_types=1);

namespace App\Tests\Maintenance\Security;

use App\Entity\Appointment;
use App\Entity\Bike;
use App\Entity\Maintenance;
use App\Entity\Repairer;
use App\Entity\RepairerEmployee;
use App\Entity\User;
use App\Repository\AppointmentRepository;
use App\Repository\BikeRepository;
use App\Repository\MaintenanceRepository;
use App\Repository\RepairerEmployeeRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class UpdateTest extends AbstractTestCase
{
    protected Maintenance $maintenance;

    protected Appointment $appointment;

    protected Bike $bike;

    protected User $user;

    protected Repairer $repairerWithAppointment;

    protected User $customer;

    protected User $boss;

    protected RepairerEmployee $repairerEmployee;

    public function setUp(): void
    {
        parent::setUp();

        $this->maintenance = static::getContainer()->get(MaintenanceRepository::class)->findOneBy([], ['id' => 'ASC']);
        $this->user = static::getContainer()->get(UserRepository::class)->findOneBy(['email' => 'user1@test.com']);
        $this->appointment = static::getContainer()->get(AppointmentRepository::class)->findOneBy(['customer' => $this->user]);
        $this->repairerWithAppointment = $this->appointment->repairer;
        $this->boss = $this->repairerWithAppointment->owner;
        $this->customer = $this->appointment->customer;
        $this->repairerEmployee = static::getContainer()->get(RepairerEmployeeRepository::class)->findOneBy(['repairer' => $this->repairerWithAppointment]);
        $this->bike = static::getContainer()->get(BikeRepository::class)->findOneBy(['owner' => $this->customer]);
    }

    public function testUserCanUpdateMaintenanceForOwnBike(): void
    {
        $this->createClientWithUser($this->maintenance->bike->owner)->request('PUT', sprintf('/maintenances/%d', $this->maintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'description' => 'put description',
                'bike' => sprintf('/bikes/%d', $this->maintenance->bike->id),
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testAdminCanUpdateMaintenanceForBike(): void
    {
        $this->createClientAuthAsAdmin()->request('PUT', sprintf('/maintenances/%d', $this->maintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'description' => 'put by admin description',
                'bike' => sprintf('/bikes/%d', $this->maintenance->bike->id),
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testUserCannotUpdateMaintenanceForOtherBike(): void
    {
        $this->createClientAuthAsUser()->request('PUT', sprintf('/maintenances/%d', $this->maintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'description' => 'put description',
                'bike' => sprintf('/bikes/%d', $this->maintenance->bike->id),
            ],
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testRepairerBossCanUpdateHisMaintenances(): void
    {
        $client = $this->createClientWithUser($this->boss);
        // boss add maintenance on bike's customer
        $client->request('POST', '/maintenances', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'create by boss',
                'description' => 'create by boss description',
                'bike' => sprintf('/bikes/%d', $this->bike->id),
                'repairDate' => '2023-04-28 14:30:00',
            ],
        ]);
        $this->assertResponseIsSuccessful();

        $maintenance = static::getContainer()->get(MaintenanceRepository::class)->findOneBy(['author' => $this->boss]);

        $client->request('PUT', sprintf('/maintenances/%d', $maintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'description' => 'put by boss',
                'bike' => sprintf('/bikes/%d', $maintenance->bike->id),
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testRepairerBossCannotUpdateOtherMaintenances(): void
    {
        // According to the fixtures, maintenance is not from this boss
        $this->createClientWithUser($this->boss)->request('PUT', sprintf('/maintenances/%d', $this->maintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'description' => 'put by other boss',
                'bike' => sprintf('/bikes/%d', $this->maintenance->bike->id),
            ],
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testRepairerEmployeeCanUpdateHisMaintenances(): void
    {
        $client = $this->createClientWithUser($this->repairerEmployee->employee);
        // employee add maintenance on bike's customer
        $client->request('POST', '/maintenances', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'create by employee',
                'description' => 'create by employee description',
                'bike' => sprintf('/bikes/%d', $this->bike->id),
                'repairDate' => '2023-04-28 14:30:00',
            ],
        ]);
        $this->assertResponseIsSuccessful();

        $maintenance = static::getContainer()->get(MaintenanceRepository::class)->findOneBy(['author' => $this->repairerEmployee->employee]);

        $client->request('PUT', sprintf('/maintenances/%d', $maintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'description' => 'put by employee',
                'bike' => sprintf('/bikes/%d', $maintenance->bike->id),
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testRepairerEmployeeCannotUpdateOtherMaintenances(): void
    {
        // According to the fixtures, maintenance is not from this employee
        $this->createClientWithUser($this->repairerEmployee->employee)->request('PUT', sprintf('/maintenances/%d', $this->maintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'description' => 'put by other employee',
                'bike' => sprintf('/bikes/%d', $this->maintenance->bike->id),
            ],
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
