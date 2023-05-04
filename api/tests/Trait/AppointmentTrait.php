<?php

declare(strict_types=1);

namespace App\Tests\Trait;

use App\Entity\Appointment;
use App\Repository\AppointmentRepository;

trait AppointmentTrait
{
    private AppointmentRepository $appointmentRepository;

    public function getAppointment(): ?Appointment
    {
        return $this->appointmentRepository->findOneBy([]);
    }
}
