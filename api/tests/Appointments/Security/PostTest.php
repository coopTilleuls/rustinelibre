<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Security;

use App\Repository\RepairerRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class PostTest extends AbstractTestCase
{
    private RepairerRepository $repairerRepository;

    private UserRepository $userRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
        $this->userRepository = self::getContainer()->get(UserRepository::class);
    }

    public function testUserCanCreateAppointment(): void
    {
        $user = $this->userRepository->getUserWithoutRepairer();
        $repairer = $this->repairerRepository->findOneBy([]);
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
        $repairer = $this->repairerRepository->findOneBy([]);
        self::createClient()->request('POST', '/appointments', [
            'json' => [
                'slotTime' => (new \DateTimeImmutable('+ 1day'))->format('Y-m-d H:i:s'),
                'repairer' => sprintf('/repairers/%d', $repairer->id),
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }
}
