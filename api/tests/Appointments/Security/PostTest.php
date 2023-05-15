<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Security;

use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;

class PostTest extends AbstractTestCase
{
    private RepairerRepository $repairerRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
    }

    public function testUserCanCreateAppointment(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $this->createClientAuthAsUser()->request('POST', '/appointments', [
            'json' => [
                'slotTime' => (new \DateTimeImmutable('+ 1day'))->format('Y-m-d H:i:s'),
                'repairer' => sprintf('/repairers/%d', $repairer->id),
            ],
        ]);

        self::assertResponseStatusCodeSame(201);
    }

    public function testUnauthenticatedCannotCreateAppointment(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        self::createClient()->request('POST', '/appointments', [
            'json' => [
                'slotTime' => (new \DateTimeImmutable('+ 1day'))->format('Y-m-d H:i:s'),
                'repairer' => sprintf('/repairers/%d', $repairer->id),
            ],
        ]);

        self::assertResponseStatusCodeSame(401);
    }
}
