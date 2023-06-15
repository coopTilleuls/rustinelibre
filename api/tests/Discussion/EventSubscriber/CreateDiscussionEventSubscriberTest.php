<?php

declare(strict_types=1);

namespace App\Tests\Discussion\EventSubscriber;

use App\Repository\DiscussionRepository;
use App\Tests\Repairer\Slots\SlotsTestCase;
use Symfony\Component\HttpFoundation\Response;

class CreateDiscussionEventSubscriberTest extends SlotsTestCase
{
    private DiscussionRepository $discussionRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->discussionRepository = self::getContainer()->get(DiscussionRepository::class);
    }

    public function testDiscussionIsCreatedAfterAppointmentCreation(): void
    {
        $userWithoutAppointment = $this->userRepository->findOneBy(['email' => 'user1@test.com']);
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientWithUser($userWithoutAppointment);

        $slots = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($slots), $slots[array_key_first($slots)][0]);

        $client->request('POST', '/appointments', [
            'json' => [
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s'),
                'repairer' => sprintf('/repairers/%d', $repairer->id),
            ],
        ])->toArray();
        self::assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->discussionRepository = self::getContainer()->get(DiscussionRepository::class);
        self::assertNotNull($this->discussionRepository->findOneBy(['repairer' => $repairer->id, 'customer' => $userWithoutAppointment->id]));
    }
}
