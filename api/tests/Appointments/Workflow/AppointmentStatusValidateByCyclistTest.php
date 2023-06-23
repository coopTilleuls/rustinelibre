<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Workflow;

use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;

class AppointmentStatusValidateByCyclistTest extends AbstractTestCase
{
    private AppointmentRepository $appointmentRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
    }

    public function testCyclistCannotValidateFromPendingRepairer(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_repairer']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'validated_by_cyclist',
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertNotSame('validated', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCannotValidateFromRefuse(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'refused']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'validated_by_cyclist',
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertNotSame('validated', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testCyclistCannotValidateFromCancel(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'cancel']);
        $this->createClientWithUser($appointment->customer)->request('PUT', sprintf('/appointment_transition/%d', $appointment->id), [
            'json' => [
                'transition' => 'validated_by_cyclist',
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertNotSame('validated', $this->appointmentRepository->find($appointment->id)->status);
    }
}
