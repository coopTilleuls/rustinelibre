<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Slots\SlotsAvailable;

use App\Entity\User;
use App\Tests\Repairer\Slots\SlotsTestCase;

class SlotsAvailableChangeWithAppointmentEventTest extends SlotsTestCase
{
    private User $user;
    public function setUp(): void
    {
        parent::setUp();
        //Get user with ROLE_USER
        $this->user = $this->userRepository->findOneBy(['email' => 'user1@test.com']);
    }
    /*
         * test if slots available are updated after appointment creation
         */
    public function testSlotsAvailableAreUpdatedAfterNewAppointment(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable(1);
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($firstResponse), $firstResponse[array_key_first($firstResponse)][0]);

        $response = $client->request('POST', '/appointments', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s '),
            ],
        ]);

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse, $secondResponse);
    }

    /*
     * test if slots available are updated after appointment deletion
     */
    public function testSlotsAvailableAreUpdatedAfterAppointmentDeletion(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable(1);
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($firstResponse), $firstResponse[array_key_first($firstResponse)][0]);

        $appointmentResponse = $client->request('POST', '/appointments', [
            'json' => [
                'customer' => sprintf('/users/%d', $this->user->id),
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s '),
            ],
        ])->toArray();

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();

        $client->request('DELETE', sprintf('/appointments/%d', $appointmentResponse['id']));

        $thirdResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($thirdResponse, $secondResponse);
    }

    /*
     * test if slots available are updated after appointment refusal
     */
    public function testSlotsAvailableAreUpdatedAfterAppointmentRefusal(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable(1);
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($firstResponse), $firstResponse[array_key_first($firstResponse)][0]);

        $appointmentResponse = $client->request('POST', '/appointments', [
            'json' => [
                'customer' => sprintf('/users/%d', $this->user->id),
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s '),
            ],
        ])->toArray();

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();

        $client->request('PUT', sprintf('/appointment_transition/%d', $appointmentResponse['id']), [
            'json' => [
                'transition' => 'refused',
            ],
        ]);

        $thirdResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($thirdResponse, $secondResponse);
    }
}
