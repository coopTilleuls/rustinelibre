<?php

declare(strict_types=1);

namespace App\Tests\RepairerOpeningHours;

use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;

class AssertRepairerOpeningHoursTest extends AbstractTestCase
{
    private RepairerRepository $repairerRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
    }

    public function testCreateWithBadFormattedStartTime(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '10:18',
                'endTime' => '18:00',
            ],
        ]);

        self::assertResponseStatusCodeSame(422);
        self::assertStringContainsString('startTime: This value is not valid.', $response->getContent(false));
    }

    public function testCreateWithBadFormattedEndTime(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '10:00',
                'endTime' => '18:18',
            ],
        ]);

        self::assertResponseStatusCodeSame(422);
        self::assertStringContainsString('endTime: This value is not valid.', $response->getContent(false));
    }

    public function testCreateWithStartTimeGreatherThanEndTime(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '10:00',
                'endTime' => '09:00',
            ],
        ]);

        self::assertResponseStatusCodeSame(422);
        self::assertStringContainsString('The endTime cannot be before startTime', $response->getContent(false));
    }

    public function testCreateWithBadDay(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'mondayy',
                'startTime' => '10:00',
                'endTime' => '18:00',
            ],
        ]);

        self::assertResponseStatusCodeSame(422);
        self::assertStringContainsString('This day is not available, should be one of : monday, tuesday, wednesday, thursday, friday, saturday, sunday', $response->getContent(false));
    }
}
