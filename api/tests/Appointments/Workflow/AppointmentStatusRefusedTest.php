<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Workflow;

use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;

class AppointmentStatusRefusedTest extends AbstractTestCase
{
    private AppointmentRepository $appointmentRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
    }

    public function testRepairerCanRefuseFromPendingRepairer(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_repairer']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_status/%d', $appointment->id), [
            'json' => [
                'transition' => 'refused',
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('refused', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCannotRefuseFromPendingCyclist(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_cyclist']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_status/%d', $appointment->id), [
            'json' => [
                'transition' => 'refused',
            ],
        ]);
        self::assertResponseStatusCodeSame(403);
        self::assertSame('pending_cyclist', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCanRefuseFromPendingCyclist(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_cyclist']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_status/%d', $appointment->id), [
            'json' => [
                'transition' => 'refused',
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('refused', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCannotRefuseFromPendingRepairer(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_repairer']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_status/%d', $appointment->id), [
            'json' => [
                'transition' => 'refused',
            ],
        ]);
        self::assertResponseStatusCodeSame(403);
        self::assertSame('pending_repairer', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCannotRefuseFromCancel(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'cancel']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_status/%d', $appointment->id), [
            'json' => [
                'transition' => 'refused',
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertNotSame('refused', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCannotRefuseFromCancel(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'cancel']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_status/%d', $appointment->id), [
            'json' => [
                'transition' => 'refused',
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertNotSame('refused', $this->appointmentRepository->find($appointment->id)->status);
    }
}
