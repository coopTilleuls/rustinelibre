<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Security;

use App\Tests\Repairer\Slots\SlotsTestCase;
use Symfony\Component\HttpFoundation\Response;

class PostTest extends SlotsTestCase
{
    public function testUserCanCreateAppointment(): void
    {
        $user = $this->userRepository->getUserWithoutRepairer();
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientWithUser($user);

        $slots = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($slots), $slots[array_key_first($slots)][0]);

        $response = $client->request('POST', '/appointments', [
            'json' => [
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s'),
                'repairer' => sprintf('/repairers/%d', $repairer->id),
            ],
        ])->toArray();

        self::assertResponseStatusCodeSame(Response::HTTP_CREATED);
        self::assertSame(sprintf('/users/%d', $user->id), $response['customer']['@id']);
    }

    public function testUnauthenticatedCannotCreateAppointment(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = self::createClient();

        $slots = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($slots), $slots[array_key_first($slots)][0]);

        $client->request('POST', '/appointments', [
            'json' => [
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s'),
                'repairer' => sprintf('/repairers/%d', $repairer->id),
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }
}
