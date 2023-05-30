<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Slots\SlotsAvailable;

use App\Tests\Repairer\Slots\SlotsTestCase;

class SlotsAvailableChangeWithOpeningHoursEventTest extends SlotsTestCase
{
    /*
         * test if slots available are updated after opening hours creation
         */
    public function testSlotsAvailableAreUpdatedAfterOpeningHoursCreation(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();

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

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse, $secondResponse);
    }

    /*
     * test if slots available are updated after opening hours deletion
     */
    public function testSlotsAvailableAreUpdatedAfterOpeningHoursDeletion(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientAuthAsAdmin();
        $roh = $client->request('GET', sprintf('/repairer_opening_hours?repairer=/repairers/%d', $repairer->id))->toArray()['hydra:member'][0];

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();

        $client->request('DELETE', sprintf('/repairer_opening_hours/%d', $roh['id']));

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse, $secondResponse);
    }
}
