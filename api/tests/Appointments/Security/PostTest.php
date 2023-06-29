<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Security;

use App\Entity\Appointment;
use App\Entity\Repairer;
use App\Entity\User;
use App\Repository\RepairerEmployeeRepository;
use App\Tests\Repairer\Slots\SlotsTestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;

class PostTest extends SlotsTestCase
{
    private RepairerEmployeeRepository $repairerEmployeeRepository;
    private User $userWithoutAppointment;

    private Repairer $repairerWithAppointment;

    private Appointment $appointment;

    private Repairer $repairerWithoutAppointment;

    private TranslatorInterface $translator;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerEmployeeRepository = static::getContainer()->get(RepairerEmployeeRepository::class);
        $this->translator = static::getContainer()->get(TranslatorInterface::class);
        $this->userWithoutAppointment = $this->userRepository->findOneBy(['email' => 'user1@test.com']);
        $boss = $this->userRepository->findOneBy(['email' => 'boss@test.com']);
        $boss2 = $this->userRepository->findOneBy(['email' => 'boss2@test.com']);
        $this->repairerWithAppointment = $this->repairerRepository->findOneBy(['owner' => $boss]);
        $this->appointment = $this->appointmentRepository->findOneBy(['repairer' => $this->repairerWithAppointment->id]);
        $this->repairerWithoutAppointment = $this->repairerRepository->findOneBy(['owner' => $boss2]);
    }

    public function testUserCanCreateAppointment(): void
    {
        $repairer = $this->getRepairerWithSlotsAvailable();
        $client = $this->createClientWithUser($this->userWithoutAppointment);

        $slots = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($slots), $slots[array_key_first($slots)][0]);

        $response = $client->request('POST', '/appointments', [
            'json' => [
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s'),
                'repairer' => sprintf('/repairers/%d', $repairer->id),
            ],
        ])->toArray();

        self::assertResponseStatusCodeSame(Response::HTTP_CREATED);
        self::assertSame(sprintf('/users/%d', $this->userWithoutAppointment->id), $response['customer']['@id']);
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

    public function testBossCanCreateAppointmentForCustomer(): void
    {
        $client = $this->createClientWithUser($this->repairerWithAppointment->owner);

        $slots = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $this->repairerWithAppointment->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($slots), $slots[array_key_first($slots)][0]);

        $client->request('POST', '/appointments', [
            'json' => [
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s'),
                'repairer' => sprintf('/repairers/%d', $this->repairerWithAppointment->id),
                'customer' => sprintf('/users/%d', $this->appointment->customer->id),
            ],
        ])->toArray();
        self::assertResponseStatusCodeSame(Response::HTTP_CREATED);
    }

    public function testBossCannotCreateAppointmentForOtherUser(): void
    {
        $client = $this->createClientWithUser($this->repairerWithoutAppointment->owner);

        $slots = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $this->repairerWithoutAppointment->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($slots), $slots[array_key_first($slots)][0]);

        $client->request('POST', '/appointments', [
            'json' => [
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s'),
                'repairer' => sprintf('/repairers/%d', $this->repairerWithoutAppointment->id),
                'customer' => sprintf('/users/%d', $this->userWithoutAppointment->id),
            ],
        ]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_FORBIDDEN);
        self::assertJsonContains([
            'hydra:title' => 'An error occurred',
            'hydra:description' => $this->translator->trans('403_access.denied.customer', domain: 'validators'),
        ]);
    }

    public function testEmployeeCanCreateAppointmentForCustomer(): void
    {
        $repairerEmployee = $this->repairerEmployeeRepository->findOneBy(['repairer' => $this->repairerWithAppointment]);
        $client = $this->createClientWithUser($repairerEmployee->employee);

        $slots = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $this->repairerWithAppointment->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($slots), $slots[array_key_first($slots)][0]);

        $client->request('POST', '/appointments', [
            'json' => [
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s'),
                'repairer' => sprintf('/repairers/%d', $this->repairerWithAppointment->id),
                'customer' => sprintf('/users/%d', $this->appointment->customer->id),
            ],
        ])->toArray();
        self::assertResponseStatusCodeSame(Response::HTTP_CREATED);
    }

    public function testEmployeeCannotCreateAppointmentForOtherUser(): void
    {
        $repairerEmployee = $this->repairerEmployeeRepository->findOneBy(['repairer' => $this->repairerWithoutAppointment]);
        $client = $this->createClientWithUser($repairerEmployee->employee);

        $slots = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $this->repairerWithoutAppointment->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($slots), $slots[array_key_first($slots)][0]);

        $client->request('POST', '/appointments', [
            'json' => [
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s'),
                'repairer' => sprintf('/repairers/%d', $this->repairerWithoutAppointment->id),
                'customer' => sprintf('/users/%d', $this->userWithoutAppointment->id),
            ],
        ]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_FORBIDDEN);
        self::assertJsonContains([
            'hydra:title' => 'An error occurred',
            'hydra:description' => $this->translator->trans('403_access.denied.customer', domain: 'validators'),
        ]);
    }
}
