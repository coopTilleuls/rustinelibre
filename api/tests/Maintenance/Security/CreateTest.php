<?php

declare(strict_types=1);

namespace App\Tests\Maintenance\Security;

use App\Entity\Maintenance;
use App\Repository\MaintenanceRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class CreateTest extends AbstractTestCase
{
    /** @var Maintenance[] */
    protected array $maintenances = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->maintenances = static::getContainer()->get(MaintenanceRepository::class)->findAll();
    }

    public function testUserCanCreateMaintenanceForOwnBike(): void
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
    }
}
