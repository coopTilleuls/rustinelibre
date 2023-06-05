<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Slots\FirstSlotAvailable;

use App\Repository\AppointmentRepository;
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

        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
        $appointment = $this->appointmentRepository->findOneBy(['repairer' => $repairer]);

        $firstResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();

        $client->request('DELETE', sprintf('/appointments/%d', $appointment->id));

        $secondResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse['firstSlotAvailable'], $secondResponse['firstSlotAvailable']);
    }

    /**
     * if there is no slot available left on a slot, firstSlotAvailable should change after appointment refusal on this slot.
     */
    public function testFirstSlotAvailableChangeAfterAppointmentRefusalAndSlotBecomesAvailable(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable(0);
        $client = $this->createClientWithUser($repairer->owner);

        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
        $appointment = $this->appointmentRepository->findOneBy(['repairer' => $repairer]);

        $firstResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();

        $client->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'refused',
            ],
        ]);

        $secondResponse = $client->request('GET', sprintf('/repairers/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse['firstSlotAvailable'], $secondResponse['firstSlotAvailable']);
    }
}
