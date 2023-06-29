<?php

declare(strict_types=1);

namespace App\Appointments\Services;

use App\Entity\Appointment;
use App\Repository\AppointmentRepository;
use Symfony\Component\Workflow\WorkflowInterface;

readonly class AppointmentsCanceller
{
    public function __construct(private AppointmentRepository $appointmentRepository, private WorkflowInterface $appointmentAcceptanceStateMachine)
    {
    }

    public function cancelOldAppointments(): void
    {
        /** @var Appointment[] $appointmentsToCancel */
        $appointmentsToCancel = $this->appointmentRepository->getOldOrDelayedAppointments();

        foreach ($appointmentsToCancel as $appointment) {
            if ($this->appointmentAcceptanceStateMachine->can($appointment, 'cancellation')) {
                $this->appointmentAcceptanceStateMachine->apply($appointment, 'cancellation');
            }
        }
    }
}
