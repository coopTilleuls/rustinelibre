<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Entity\Appointment;

final readonly class AppointmentRefusedNotification
{
    public function __construct(private FirebaseNotifier $firebaseNotifier)
    {
    }

    public function sendRefusedAppointmentNotification(Appointment $appointment): void
    {
        $notification = new Notification(
            recipient: $appointment->customer,
            title: 'Demande de RDV refusée',
            body: sprintf('Votre RDV du %s a été refusé', $appointment->slotTime->format('d-m-Y H:i')),
            params: [
                'route' => '/',
            ]
        );

        $this->firebaseNotifier->sendNotification($notification);
    }
}
