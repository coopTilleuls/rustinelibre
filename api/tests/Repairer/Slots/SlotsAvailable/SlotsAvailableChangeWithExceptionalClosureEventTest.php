<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Slots\SlotsAvailable;

use App\Tests\Repairer\Slots\SlotsTestCase;

class SlotsAvailableChangeWithExceptionalClosureEventTest extends SlotsTestCase
{
    /*
     * test if slots available are updated after exceptional closure creation
     */
    public function testSlotsAvailableAreUpdatedAfterExceptionalClosureCreation(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();

        $client->request('POST', '/repairer_exceptional_closures', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'startDate' => (new \DateTime('+15 days'))->format('Y-m-d'),
                'endDate' => (new \DateTime('+30 days'))->format('Y-m-d'),
            ],
        ]);

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse, $secondResponse);
    }

    /*
     * test if slots available are updated after exceptional closure deletion
     */
    public function testSlotsAvailableAreUpdatedAfterExceptionalClosureDeletion(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientAuthAsAdmin();

        $rec = $client->request('POST', 'repairer_exceptional_closures', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'startDate' => (new \DateTime('now'))->format('Y-m-d H:i:s'),
                'endDate' => (new \DateTime('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ])->toArray();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();

        $client->request('DELETE', sprintf('/repairer_exceptional_closures/%d', $rec['id']));

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse, $secondResponse);
    }
}
