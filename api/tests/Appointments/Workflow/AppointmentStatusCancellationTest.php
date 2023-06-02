<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Workflow;

use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;

class AppointmentStatusCancellationTest extends AbstractTestCase
{
    private AppointmentRepository $appointmentRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
    }

    public function testRepairerCanCancelFromPendingRepairer(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_repairer']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'cancellation',
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('cancel', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCanCancelFromPendingCyclist(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_cyclist']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'cancellation',
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('cancel', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCanCancelFromValidated(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'validated']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'cancellation',
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('cancel', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCannotCancelFromRefused(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'refused']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'cancellation',
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertNotSame('cancel', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCanCancelFromPendingRepairer(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_repairer']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'cancellation',
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('cancel', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCanCancelFromPendingCyclist(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_cyclist']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'cancellation',
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('cancel', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCanCancelFromValidated(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'validated']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'cancellation',
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('cancel', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCannotCancelFromRefused(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'refused']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'cancellation',
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertNotSame('cancel', $this->appointmentRepository->find($appointment->id)->status);
    }
}
