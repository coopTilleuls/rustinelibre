<?php

declare(strict_types=1);

namespace App\Tests\Maintenance\Security;

use App\Entity\Appointment;
use App\Entity\Bike;
use App\Entity\Maintenance;
use App\Entity\Repairer;
use App\Entity\User;
use App\Repository\AppointmentRepository;
use App\Repository\BikeRepository;
use App\Repository\MaintenanceRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class CreateTest extends AbstractTestCase
{
    /** @var Maintenance[] */
    protected array $maintenances = [];

    /** @var Appointment[] */
    protected array $appointments = [];

    protected Bike $bike;

    protected Repairer $repairerWithAppointment;

    protected User $customer;

    protected User $boss;

    public function setUp(): void
    {
        parent::setUp();

        $this->maintenances = static::getContainer()->get(MaintenanceRepository::class)->findAll();
        $this->appointments = static::getContainer()->get(AppointmentRepository::class)->findAll();
        $appointment = $this->appointments[0];
        $this->repairerWithAppointment = $appointment->repairer;
        $this->boss = $this->repairerWithAppointment->owner;
        $this->customer = $appointment->customer;
        $this->bike = static::getContainer()->get(BikeRepository::class)->findOneBy(['owner' => $this->customer]);
    }


/*    public function testUserCanCreateMaintenanceForOwnBike(): void
    {
        $maintenance = $this->maintenances[0];

        $this->createClientWithUser($maintenance->bike->owner)->request('POST', '/maintenances', [
        'headers' => ['Content-Type' => 'application/json'],
        'json' => [
            'name' => 'Test',
            'description' => 'test description',
            'bike' => sprintf('/bikes/%d', $maintenance->bike->id),
            'repairDate' => '2023-04-28 14:30:00',
            ],
            ]);

        $this->assertResponseIsSuccessful();
    }

    public function testUserCannotCreateMaintenanceForOtherBike(): void
    {
        $maintenance = $this->maintenances[0];
        $this->createClientAuthAsUser()->request('POST', '/maintenances', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Test',
                'description' => 'test description',
                'bike' => sprintf('/bikes/%d', $maintenance->bike->id),
                'repairDate' => '2023-04-28 14:30:00',
            ],
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'bike: The bike should be your bike to modify it',
        ]);
    }*/

    public function testBossCanCreateMaintenanceForCustomer(): void
    {
        $response = $this->createClientWithUser($this->boss)->request('POST', '/maintenances', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Test',
                'description' => 'test description',
                'bike' => sprintf('/bikes/%d', $this->bike->id),
                'repairDate' => '2023-04-28 14:30:00',
            ],
        ]);
        $response = $response->toArray();
dd($response);
        $this->assertResponseIsSuccessful();
    }
/*    public function testBossCannotCreateMaintenanceForOtherUsers(): void
    {
        $maintenance = $this->maintenances[0];
        $this->createClientWithUser($this->boss)->request('POST', '/maintenances', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Test',
                'description' => 'test description',
                'bike' => sprintf('/bikes/%d', $maintenance->bike->id),
                'repairDate' => '2023-04-28 14:30:00',
            ],
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'bike: The bike should be your bike to modify it',
        ]);
    }*/

}
