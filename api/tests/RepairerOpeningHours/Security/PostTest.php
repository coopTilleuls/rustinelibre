<?php

declare(strict_types=1);

namespace App\Tests\RepairerOpeningHours\Security;

use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;
use App\Tests\Trait\RepairerTrait;

class PostTest extends AbstractTestCase
{
    use RepairerTrait;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
    }

    public function testAdminCanCreateRepairerOpeningHours(): void
    {
        $repairer = $this->getRepairer();
        $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '10:00',
                'endTime' => '18:00',
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
    }

    public function testBossCanCreateRepairerOpeningHours(): void
    {
        $repairer = $this->getRepairer();
        $this->createClientAuthAsBoss()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '10:00',
                'endTime' => '18:00',
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
    }

    public function testUserCannotCreateRepairerOpeningHours(): void
    {
        $repairer = $this->getRepairer();
        $this->createClientAuthAsUser()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '10:00',
                'endTime' => '18:00',
            ],
        ]);

        self::assertResponseStatusCodeSame(403);
    }
}
