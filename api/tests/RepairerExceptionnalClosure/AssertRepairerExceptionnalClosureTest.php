<?php

declare(strict_types=1);

namespace App\Tests\RepairerExceptionnalClosure;

use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;

class AssertRepairerExceptionnalClosureTest extends AbstractTestCase
{
    private RepairerRepository $repairerRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
    }

    public function testCreateWithEndDateBeforeStartDate(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_exceptional_closures',
            [
                'json' => [
                    'repairer' => sprintf('/repairers/%d', $repairer->id),
                    'startDate' => (new \DateTime('+1 day'))->format('Y-m-d'),
                    'endDate' => (new \DateTime('-1 day'))->format('Y-m-d'),
                ],
            ]
        );

        self::assertResponseStatusCodeSame(422);
        self::assertStringContainsString('The endDate cannot be before startDate', $response->getContent(false));
    }
}
