<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Workflow;

use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;

class AppointmentStatusValidateByRepairerTest extends AbstractTestCase
{
    private AppointmentRepository $appointmentRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
    }

    public function testRepairerCanValidateFromPendingRepairer(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_repairer']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_status/%d', $appointment->id), [
            'json' => [
                'transition' => 'validated_by_repairer',
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertSame('validated', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCannotValidateFromPendingCyclist(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'pending_cyclist']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_status/%d', $appointment->id), [
            'json' => [
                'transition' => 'validated_by_repairer',
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertNotSame('validated', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCannotValidateFromRefuse(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'refused']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_status/%d', $appointment->id), [
            'json' => [
                'transition' => 'validated_by_repairer',
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertNotSame('validated', $this->appointmentRepository->find($appointment->id)->status);
    }

    public function testRepairerCannotValidateFromCancel(): void
    {
        $appointment = $this->appointmentRepository->findOneBy(['status' => 'cancel']);
        $this->createClientWithUser($appointment->repairer->owner)->request('PUT', sprintf('/appointment_status/%d', $appointment->id), [
            'json' => [
                'transition' => 'validated_by_repairer',
            ],
        ]);
        self::assertResponseStatusCodeSame(400);
        self::assertNotSame('validated', $this->appointmentRepository->find($appointment->id)->status);
    }
}
