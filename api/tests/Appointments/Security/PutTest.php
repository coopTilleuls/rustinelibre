<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Security;

use App\Entity\Appointment;
use App\Repairers\Service\UpdateOldFirstSlotAvailableService;
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
        self::getContainer()->get(UpdateOldFirstSlotAvailableService::class)->updateOldFirstSlotAvailable();
        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
        $appointment = $this->getAppointment();
        if (!$appointment instanceof Appointment) {
            self::fail('Appointment not found');
        }
        $this->appointment = $appointment;
    }

    public function testPutAppointmentWithAvailableSlot(): void
    {
        $client = $this->createClientAuthAsAdmin();
        $client->request('PUT', sprintf('/appointments/%d', $this->appointment->id), [
            'json' => [
                'slotTime' => $this->appointment->repairer->firstSlotAvailable->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testPutAppointmentWithUnavailableSlot(): void
    {
        $client = $this->createClientAuthAsAdmin();
        $client->request('PUT', sprintf('/appointments/%d', $this->appointment->id), [
            'json' => [
                'slotTime' => (new \DateTime())->setDate(2025, 12, 12)->setTime(01, 01)->format('Y-m-d H:i:s'),
            ],
        ]);
        self::assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }
}
