<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Security;

use App\Entity\Appointment;
use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;
use App\Tests\Trait\AppointmentTrait;
use Symfony\Component\HttpFoundation\Response;

class PutTest extends AbstractTestCase
{
    use AppointmentTrait;

    private Appointment $appointment;

    public function setUp(): void
    {
        parent::setUp();
        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
        $appointment = $this->getAppointment();
        if (!$appointment instanceof Appointment) {
            self::fail('Appointment not found');
        }
        $this->appointment = $appointment;
    }

    public function testToggleAcceptedWithAdmin(): void
    {
        $accepted = $this->appointment->accepted;

        $this->createClientAuthAsAdmin()->request(
            'PUT',
            sprintf('/appointments/%d', $this->appointment->id),
            [
                'json' => [
                    'slotTime' => (new \DateTimeImmutable('+ 1day'))->format('Y-m-d H:i:s'),
                    'repairer' => sprintf('/repairers/%d', $this->appointment->repairer->id),
                    'accepted' => !$accepted,
                ],
            ]
        );

        $appointmentUpdated = $this->appointmentRepository->find($this->appointment->id);
        self::assertResponseIsSuccessful();
        self::assertSame(!$accepted, $appointmentUpdated->accepted);
    }

    public function testToggleAcceptedWithOwner(): void
    {
        $accepted = $this->appointment->accepted;

        $this->createClientWithUser($this->appointment->repairer->owner)->request(
            'PUT',
            sprintf('/appointments/%d', $this->appointment->id),
            [
                'json' => [
                    'slotTime' => (new \DateTimeImmutable('+ 1day'))->format('Y-m-d H:i:s'),
                    'repairer' => sprintf('/repairers/%d', $this->appointment->repairer->id),
                    'accepted' => !$accepted,
                ],
            ]
        );

        $appointmentUpdated = $this->appointmentRepository->find($this->appointment->id);
        self::assertResponseIsSuccessful();
        self::assertSame(!$accepted, $appointmentUpdated->accepted);
    }

    public function testToggleAcceptedWithCustomer(): void
    {
        $accepted = $this->appointment->accepted;

        $this->createClientWithUser($this->appointment->customer)->request(
            'PUT',
            sprintf('/appointments/%d', $this->appointment->id),
            [
                'json' => [
                    'slotTime' => (new \DateTimeImmutable('+ 1day'))->format('Y-m-d H:i:s'),
                    'repairer' => sprintf('/repairers/%d', $this->appointment->repairer->id),
                    'accepted' => !$accepted,
                ],
            ]
        );

        $appointmentUpdated = $this->appointmentRepository->find($this->appointment->id);
        self::assertResponseStatusCodeSame(Response::HTTP_OK);
        self::assertSame($accepted, $appointmentUpdated->accepted);
    }

    public function testToggleAcceptedWithOtherUser(): void
    {
        $accepted = $this->appointment->accepted;

        $this->createClientAuthAsUser()->request(
            'PUT',
            sprintf('/appointments/%d', $this->appointment->id),
            [
                'json' => [
                    'slotTime' => (new \DateTimeImmutable('+ 1day'))->format('Y-m-d H:i:s'),
                    'repairer' => sprintf('/repairers/%d', $this->appointment->repairer->id),
                    'accepted' => !$accepted,
                ],
            ]
        );

        $appointmentUpdated = $this->appointmentRepository->find($this->appointment->id);
        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
        self::assertSame($accepted, $appointmentUpdated->accepted);
    }
}
