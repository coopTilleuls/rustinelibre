<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Slots\FirstSlotAvailable;

use App\Tests\Repairer\Slots\SlotsTestCase;

class FirstSlotAvailableChangeWithOpeningHoursEventTest extends SlotsTestCase
{
    /**
     * if there is a new opening hours added, firstSlotAvailable should be updated.
     */
    public function testFirstSlotAvailableIsUpdatedAfterAddingOpeningHours(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();

        foreach (SlotsTestCase::DAYS as $day) {
            $client->request('POST', 'repairer_opening_hours', [
                'json' => [
                    'repairer' => sprintf('/repairers/%d', $repairer->id),
                    'day' => $day,
                    'startTime' => '09:00',
                    'endTime' => '21:00',
                ],
            ]);
        }

        $secondResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse['firstSlotAvailable'], $secondResponse['firstSlotAvailable']);
    }

    /**
     * if we remove opening hours, firstSlotAvailable should be updated.
     */
    public function testFirstSlotAvailableIsUpdatedAfterOpeningHoursDeletion(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientAuthAsAdmin();

        $rohIds = [];
        foreach (SlotsTestCase::DAYS as $day) {
            $rohResponse = $client->request('POST', 'repairer_opening_hours', [
                'json' => [
                    'repairer' => sprintf('/repairers/%d', $repairer->id),
                    'day' => $day,
                    'startTime' => '09:00',
                    'endTime' => '21:00',
                ],
            ])->toArray();
            $rohIds[] = $rohResponse['id'];
        }

        $firstResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();

        foreach ($rohIds as $rohId) {
            $client->request('DELETE', sprintf('repairer_opening_hours/%d', $rohId));
        }

        $secondResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse['firstSlotAvailable'], $secondResponse['firstSlotAvailable']);
    }
}
