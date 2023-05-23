<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Slots\SlotsAvailable;

use App\Tests\Repairer\Slots\SlotsTestCase;

class LimitSlotsAvailableTest extends SlotsTestCase
{
    public function testUserCanTakeAllSlotsAvailable(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable(4);
        $client = $this->createClientWithUser($repairer->owner);

        for ($i = 0; $i < 4; ++$i) {
            $client->request('POST', '/appointments', ['json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'slotTime' => $repairer->firstSlotAvailable->format('Y-m-d H:i:s'),
            ]]);
            self::assertResponseIsSuccessful();
        }
    }

    public function testUserCannotTakeMoreThanSlotsAvailable(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable(4);
        $client = $this->createClientWithUser($repairer->owner);

        // take all slots available
        for ($i = 0; $i < 4; ++$i) {
            $client->request('POST', '/appointments', ['json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'slotTime' => $repairer->firstSlotAvailable->format('Y-m-d H:i:s'),
            ]]);
            self::assertResponseIsSuccessful();
        }

        // try to take one more slot, not available
        $client->request('POST', '/appointments', ['json' => [
            'repairer' => sprintf('/repairers/%d', $repairer->id),
            'slotTime' => $repairer->firstSlotAvailable->format('Y-m-d H:i:s'),
        ]]);
        self::assertResponseStatusCodeSame(403);
    }
}
