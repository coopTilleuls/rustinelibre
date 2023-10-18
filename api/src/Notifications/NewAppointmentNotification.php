<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Entity\Appointment;
use App\Entity\RepairerEmployee;

final readonly class NewAppointmentNotification
{
    public function __construct(private FirebaseNotifier $firebaseNotifier)
    {
    }

    public function sendNewAppointmentNotification(Appointment $appointment): void
    {
        // Send notification to repairer
        $notification = new Notification(
            recipient: $appointment->repairer->owner,
            title: 'Nouvelle demande de RDV',
            body: $appointment->slotTime->format('d-m-Y H:i'),
            params: [
                'route' => sprintf('/sradmin?appointment=%s', $appointment->id),
            ]
        );

        $this->firebaseNotifier->sendNotification(notification: $notification);

        // Send notification to all employees
        /** @var RepairerEmployee $repairerEmployee */
        foreach ($appointment->repairer->repairerEmployees as $repairerEmployee) {
            $notification->recipient = $repairerEmployee->employee;

            $this->firebaseNotifier->sendNotification(notification: $notification);
        }
    }
}
