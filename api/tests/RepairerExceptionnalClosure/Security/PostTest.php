<?php

declare(strict_types=1);

namespace App\Tests\RepairerExceptionnalClosure\Security;

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

    public function testAdminCanCreate(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $this->createClientAuthAsAdmin()->request('POST', '/repairer_exceptional_closures',
            [
                'json' => [
                    'repairer' => sprintf('/repairers/%d', $repairer->id),
                    'startDate' => (new \DateTime('+1 day'))->format('Y-m-d'),
                    'endDate' => (new \DateTime('+2 day'))->format('Y-m-d'),
                ],
            ]
        );

        self::assertResponseStatusCodeSame(201);
    }

    public function testBossCanCreate(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $this->createClientAuthAsBoss()->request('POST', '/repairer_exceptional_closures',
            [
                'json' => [
                    'repairer' => sprintf('/repairers/%d', $repairer->id),
                    'startDate' => (new \DateTime('+1 day'))->format('Y-m-d'),
                    'endDate' => (new \DateTime('+2 day'))->format('Y-m-d'),
                ],
            ]
        );

        self::assertResponseStatusCodeSame(201);
    }
}
