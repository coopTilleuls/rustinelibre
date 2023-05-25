<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Slots\FirstSlotAvailable;

use App\Tests\Repairer\Slots\SlotsTestCase;

class FirstSlotAvailableChangeWithAppointmentEventTest extends SlotsTestCase
{
    /**
     * if there is one slot available left, firstSlotAvailable should change after new appointment creation on this slot.
     */
    public function testFirstSlotAvailableChangeAfterAppointmentCreationWhenOneSlotAvailableLeft(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable(1);
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();

        $client->request('POST', '/appointments', ['json' => [
            'repairer' => sprintf('/repairers/%d', $repairer->id),
            'slotTime' => $repairer->firstSlotAvailable->format('Y-m-d H:i:s'),
        ]]);

        $secondResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse['firstSlotAvailable'], $secondResponse['firstSlotAvailable']);
    }

    /**
     * if there is two slot available left, firstSlotAvailable should not change after new appointment creation on this slot.
     */
    public function testFirstSlotAvailableDoesNotChangeAfterAppointmentCreationWhenTwoSlotAvailableLeft(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable(2);
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();

        $client->request('POST', '/appointments', ['json' => [
            'repairer' => sprintf('/repairers/%d', $repairer->id),
            'slotTime' => $repairer->firstSlotAvailable->format('Y-m-d H:i:s'),
        ]]);

        $secondResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();
        self::assertSame($firstResponse['firstSlotAvailable'], $secondResponse['firstSlotAvailable']);
    }

    /**
     * if there is no slot available left on a slot, firstSlotAvailable should change after appointment deletion on this slot.
     */
    public function testFirstSlotAvailableChangeAfterAppointmentDeletionAndSlotBecomesAvailable(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable(0);
        $client = $this->createClientAuthAsAdmin();

        // get appointments to delete
        $appointments = $client->request('GET', sprintf('/appointments?customer=/users/%d', $repairer->owner->id))->toArray()['hydra:member'];

        $firstResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();

        foreach ($appointments as $appointment) {
            $client->request('DELETE', sprintf('/appointments/%d', $appointment['id']));
        }

        $secondResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse['firstSlotAvailable'], $secondResponse['firstSlotAvailable']);
    }

    /**
     * if there is no slot available left on a slot, firstSlotAvailable should change after appointment refusal on this slot.
     */
    public function testFirstSlotAvailableChangeAfterAppointmentRefusalAndSlotBecomesAvailable(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable(0);
        $client = $this->createClientAuthAsAdmin();

        // get all appointments to find one of our repairer to refuse
        $appointments = $client->request('GET', '/appointments')->toArray()['hydra:member'];

        $firstResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();

        foreach ($appointments as $appointment) {
            $parts = explode('/', $appointment['repairer']['@id']);
            if (end($parts) === (string) $repairer->id) {
                $client->request('PUT', sprintf('/appointment_status/%d', $appointment['id']), [
                    'json' => [
                        'transition' => 'refused',
                    ],
                ]);
                break;
            }
        }

        $secondResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse['firstSlotAvailable'], $secondResponse['firstSlotAvailable']);
    }
}
