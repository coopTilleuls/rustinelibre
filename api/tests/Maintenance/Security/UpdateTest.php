<?php

declare(strict_types=1);

namespace App\Tests\Maintenance\Security;

use App\Entity\Maintenance;
use App\Repository\MaintenanceRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class UpdateTest extends AbstractTestCase
{
    /** @var Maintenance[] */
    protected array $maintenances = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->maintenances = static::getContainer()->get(MaintenanceRepository::class)->findAll();
    }

    public function testUserCanUpdateMaintenanceForOwnBike(): void
    {
        $maintenance = $this->maintenances[0];

        $this->createClientWithUser($maintenance->bike->owner)->request('PUT', sprintf('/maintenances/%d', $maintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'put name',
                'description' => 'put description',
                'bike' => sprintf('/bikes/%d', $maintenance->bike->id),
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testAdminCanUpdateMaintenanceForBike(): void
    {
        $maintenance = $this->maintenances[0];
        $this->createClientAuthAsAdmin()->request('PUT', sprintf('/maintenances/%d', $maintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'put by admin name',
                'description' => 'put description',
                'bike' => sprintf('/bikes/%d', $maintenance->bike->id),
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testUserCannotUpdateMaintenanceForOtherBike(): void
    {
        $maintenance = $this->maintenances[0];
        $this->createClientAuthAsUser()->request('PUT', sprintf('/maintenances/%d', $maintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'put name',
                'description' => 'put description',
                'bike' => sprintf('/bikes/%d', $maintenance->bike->id),
            ],
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
