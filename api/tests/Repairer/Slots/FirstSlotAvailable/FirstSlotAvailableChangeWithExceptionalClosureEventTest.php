<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Slots\FirstSlotAvailable;

use App\Tests\Repairer\Slots\SlotsTestCase;

class FirstSlotAvailableChangeWithExceptionalClosureEventTest extends SlotsTestCase
{
    /**
     * if there is a new exceptional closure added, firstSlotAvailable should be updated.
     */
    public function testFirstSlotAvailableIsUpdatedAfterAddingExceptionalClosure(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();

        $client->request('POST', 'repairer_exceptional_closures', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'startDate' => (new \DateTimeImmutable('now'))->format('Y-m-d H:i:s'),
                'endDate' => (new \DateTimeImmutable('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);

        $secondResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse['firstSlotAvailable'], $secondResponse['firstSlotAvailable']);
    }

    /**
     * if we remove exceptional closure, firstSlotAvailable should be updated.
     */
    public function testFirstSlotAvailableIsUpdatedAfterExceptionalClosureDeletion(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientAuthAsAdmin();

        $recId = $client->request('POST', 'repairer_exceptional_closures', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'startDate' => (new \DateTimeImmutable('now'))->format('Y-m-d H:i:s'),
                'endDate' => (new \DateTimeImmutable('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ])->toArray()['id'];

        $firstResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();

        $client->request('DELETE', sprintf('repairer_exceptional_closures/%d', $recId));

        $secondResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse['firstSlotAvailable'], $secondResponse['firstSlotAvailable']);
    }
}
