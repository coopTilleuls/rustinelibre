<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Workflow;

use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;

class AppointmentStatusProposeAnotherSlotTest extends AbstractTestCase
{
    private AppointmentRepository $appointmentRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
    }

    public function testRepairerCanProposeAnotherSlotFromPendingRepairer(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_repairer']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'propose_another_slot',
                'slotTime' => (new \DateTime('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('pending_cyclist', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCanProposeAnotherSlotFromPendingCyclist(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_cyclist']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'propose_another_slot',
                'slotTime' => (new \DateTime('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('pending_cyclist', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCanProposeAnotherSlotFromValidated(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'validated']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'propose_another_slot',
                'slotTime' => (new \DateTime('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('pending_cyclist', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCannotProposeAnotherSlotFromPendingRepairer(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_repairer']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'propose_another_slot',
                'slotTime' => (new \DateTime('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseStatusCodeSame(403);
        self::assertNotSame('pending_cyclist', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCannotProposeAnotherSlotFromPendingCyclist(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_cyclist']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'propose_another_slot',
                'slotTime' => (new \DateTime('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseStatusCodeSame(403);
        self::assertSame('pending_cyclist', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCannotProposeAnotherSlotFromValidated(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'validated']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'propose_another_slot',
                'slotTime' => (new \DateTime('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseStatusCodeSame(403);
        self::assertSame('validated', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCannotProposeAnotherSlotFromRefused(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'refused']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'propose_another_slot',
                'slotTime' => (new \DateTime('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertSame('refused', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCannotProposeAnotherSlotFromRefused(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'refused']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'propose_another_slot',
                'slotTime' => (new \DateTime('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertSame('refused', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCannotProposeAnotherSlotFromCancel(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'cancel']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'propose_another_slot',
                'slotTime' => (new \DateTime('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertSame('cancel', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCannotProposeAnotherSlotFromCancel(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'cancel']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'propose_another_slot',
                'slotTime' => (new \DateTime('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertSame('cancel', $this->appointmentRepository->find($appointment->id)->status);
    }
}
