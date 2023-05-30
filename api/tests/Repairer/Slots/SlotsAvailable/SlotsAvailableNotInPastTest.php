<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Slots\SlotsAvailable;

use App\Tests\Repairer\Slots\SlotsTestCase;

class SlotsAvailableNotInPastTest extends SlotsTestCase
{
    /*
         * test if slots available for today are not in the past
         */
    public function testGetOnlySlotsAvailableNotStarted(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientAuthAsAdmin();
        $rohs = $client->request('GET', sprintf('/repairer_opening_hours?repairer=/repairers/%d', $repairer->id))->toArray()['hydra:member'];

        foreach ($rohs as $roh) {
            // reset opening hours
            $client->request('DELETE', sprintf('/repairer_opening_hours/%d', $roh['id']));
        }

        // create opening hours for all day
        $client->request('POST', '/repairer_opening_hours', ['json' => [
            'repairer' => sprintf('/repairers/%d', $repairer->id),
            'day' => strtolower((new \DateTimeImmutable())->format('l')),
            'startTime' => '00:00',
            'endTime' => '23:30',
        ]]);

        $response = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $today = $response[(new \DateTimeImmutable())->format('Y-m-d')];
        foreach ($today as $time) {
            // check if all slots available are not started
            self::assertGreaterThan((new \DateTimeImmutable())->format('H:i'), $time);
        }
    }
}
