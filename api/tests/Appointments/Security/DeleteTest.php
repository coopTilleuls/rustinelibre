<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Security;

use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

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

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testCustomerCanDeleteHisAppointment(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientWithUser($appointment->customer)->request('DELETE', sprintf('/appointments/%d', $appointment->id));

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testRepairerCanDeleteHisAppointment(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientWithUser($appointment->repairer->owner)->request('DELETE', sprintf('/appointments/%d', $appointment->id));

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testCustomerCannotDeleteOtherAppointment(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientAuthAsUser()->request('DELETE', sprintf('/appointments/%d', $appointment->id));

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testRepairerCannotDeleteOtherAppointment(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientAuthAsBoss()->request('DELETE', sprintf('/appointments/%d', $appointment->id));

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
