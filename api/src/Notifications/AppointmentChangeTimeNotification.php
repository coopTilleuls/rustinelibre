<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Entity\Appointment;
use App\Entity\Repairer;

final readonly class AppointmentChangeTimeNotification
{
    public function __construct(private FirebaseNotifier $firebaseNotifier)
    {
    }

    public function sendAppointmentChangeTimeNotification(Appointment $appointment, Repairer $repairer): void
    {
        $notification = new Notification(
            recipient: $appointment->customer,
            title: 'Votre RDV a été modifié',
            body: sprintf('Votre RDV avec %s a été modifié', $repairer->name),
            params: [
                'route' => '/rendez-vous/mes-rendez-vous',
            ]
        );

        $this->firebaseNotifier->sendNotification(notification: $notification);
    }
}
