<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Security;

use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class GetTest extends AbstractTestCase
{
    private AppointmentRepository $appointmentRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
    }

    public function testAdminCanGetAllAppointments(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', '/appointments');

        self::assertResponseIsSuccessful();
    }

    public function testAdminCanGetOneAppointment(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientAuthAsAdmin()->request('GET', sprintf('/appointments/%s', $appointment->id));

        self::assertResponseIsSuccessful();
    }

    public function testCustomerCanGetAllHisAppointments(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $response = $this->createClientWithUser($appointment->customer)->request('GET', '/appointments')->toArray();
        $customers = array_map(static function ($appointment) {
            return $appointment['customer']['@id'];
        }, $response['hydra:member']);

        self::assertResponseIsSuccessful();
        self::assertCount(1, array_unique($customers));
    }

    public function testCustomerCanGetOneOfHisAppointments(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $response = $this->createClientWithUser($appointment->customer)->request('GET', sprintf('/appointments/%s', $appointment->id))->toArray();

        self::assertResponseIsSuccessful();
        self::assertSame(sprintf('/users/%d', $appointment->customer->id), $response['customer']['@id']);
    }

    public function testCustomerCannotGetOtherAppointments(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientAuthAsUser()->request('GET', sprintf('/appointments/%s', $appointment->id));

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testRepairerCanGetAllHisAppointments(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $response = $this->createClientWithUser($appointment->repairer->owner)->request('GET', '/appointments')->toArray();
        $repairers = array_map(static function ($appointment) {
            return $appointment['repairer']['@id'];
        }, $response['hydra:member']);

        self::assertResponseIsSuccessful();
        self::assertCount(1, array_unique($repairers));
    }

    public function testRepairerCanGetOneOfHisAppointments(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $response = $this->createClientWithUser($appointment->repairer->owner)->request('GET', sprintf('/appointments/%s', $appointment->id))->toArray();

        self::assertResponseIsSuccessful();
        self::assertSame(sprintf('/repairers/%d', $appointment->repairer->id), $response['repairer']['@id']);
    }

    public function testRepairerCannotGetOtherAppointments(): void
    {
        $appointment = $this->appointmentRepository->findOneBy([]);
        $this->createClientAuthAsBoss()->request('GET', sprintf('/appointments/%s', $appointment->id));

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
