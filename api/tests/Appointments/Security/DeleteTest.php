<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Security;

use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;

class DeleteTest extends AbstractTestCase
{
    private AppointmentRepository $appointmentRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
    }

    public function testAdminCanDeleteAnAppointment(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientAuthAsAdmin()->request('DELETE', sprintf('/appointments/%d', $appointment->id));

        self::assertResponseStatusCodeSame(204);
    }

    public function testCustomerCanDeleteHisAppointment(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientWithUser($appointment->customer)->request('DELETE', sprintf('/appointments/%d', $appointment->id));

        self::assertResponseStatusCodeSame(204);
    }

    public function testRepairerCanDeleteHisAppointment(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientWithUser($appointment->repairer->owner)->request('DELETE', sprintf('/appointments/%d', $appointment->id));

        self::assertResponseStatusCodeSame(204);
    }

    public function testCustomerCannotDeleteOtherAppointment(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientAuthAsUser()->request('DELETE', sprintf('/appointments/%d', $appointment->id));

        self::assertResponseStatusCodeSame(403);
    }

    public function testRepairerCannotDeleteOtherAppointment(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientAuthAsBoss()->request('DELETE', sprintf('/appointments/%d', $appointment->id));

        self::assertResponseStatusCodeSame(403);
    }
}
