<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Entity\Appointment;

final readonly class AppointmentChangeTimeNotification
{
    public function __construct(private FirebaseNotifier $firebaseNotifier)
    {
    }

    public function sendAppointmentChangeTimeNotification(Appointment $appointment, string $oldTime): void
    {
        $notification = new Notification(
            recipient: $appointment->customer,
            title: 'Votre RDV a été modifié',
            body: sprintf('Votre RDV du %s a été modifié', $oldTime),
            params: [
                'route' => '/rendez-vous/mes-rendez-vous',
            ]
        );

        $this->firebaseNotifier->sendNotification(notification: $notification);
    }
}
