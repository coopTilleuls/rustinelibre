<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Security;

use App\Entity\Appointment;
use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;
use App\Tests\Trait\AppointmentTrait;

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

    // @todo test update appointment (not the status property)
}
