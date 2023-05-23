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

    // public function testToggleAcceptedWithAdmin(): void
    // {
    //     $this->createClientAuthAsAdmin()->request(
    //         'PUT',
    //         sprintf('/appointments/%d', $this->appointment->id),
    //         [
    //             'json' => [
    //                 'slotTime' => (new \DateTimeImmutable('+ 1day'))->format('Y-m-d H:i:s'),
    //                 'repairer' => sprintf('/repairers/%d', $this->appointment->repairer->id),
    //                 'state' => 'validated',
    //             ],
    //         ]
    //     );
    //
    //     $appointmentUpdated = $this->appointmentRepository->find($this->appointment->id);
    //     self::assertResponseIsSuccessful();
    //     self::assertSame('validated', $appointmentUpdated->state);
    // }
    //
    // public function testToggleAcceptedWithOwner(): void
    // {
    //     $this->createClientWithUser($this->appointment->repairer->owner)->request(
    //         'PUT',
    //         sprintf('/appointments/%d', $this->appointment->id),
    //         [
    //             'json' => [
    //                 'slotTime' => (new \DateTimeImmutable('+ 1day'))->format('Y-m-d H:i:s'),
    //                 'repairer' => sprintf('/repairers/%d', $this->appointment->repairer->id),
    //                 'state' => 'validated',
    //             ],
    //         ]
    //     );
    //
    //     $appointmentUpdated = $this->appointmentRepository->find($this->appointment->id);
    //     self::assertResponseIsSuccessful();
    //     self::assertSame('validated', $appointmentUpdated->state);
    // }

    public function testToggleAcceptedWithCustomer(): void
    {
        // dump($this->appointment->state);

        // die;

        $this->appointment = static::getContainer()->get(AppointmentRepository::class)->findOneBy(['state' => 'pending_repairer']);

        $this->createClientWithUser($this->appointment->customer)->request(
            'PUT',
            sprintf('/appointments/%d', $this->appointment->id),
            [
                'json' => [
                    'slotTime' => (new \DateTimeImmutable('+ 1day'))->format('Y-m-d H:i:s'),
                    'repairer' => sprintf('/repairers/%d', $this->appointment->repairer->id),
                    'state' => 'validated',
                ],
            ]
        );

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testToggleAcceptedWithOtherUser(): void
    {
        $this->createClientAuthAsUser()->request(
            'PUT',
            sprintf('/appointments/%d', $this->appointment->id),
            [
                'json' => [
                    'slotTime' => (new \DateTimeImmutable('+ 1day'))->format('Y-m-d H:i:s'),
                    'repairer' => sprintf('/repairers/%d', $this->appointment->repairer->id),
                    'state' => 'validated',
                ],
            ]
        );

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
