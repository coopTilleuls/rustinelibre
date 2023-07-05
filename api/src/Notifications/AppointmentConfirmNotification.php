<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Entity\Appointment;

final readonly class AppointmentConfirmNotification
{
    public function __construct(private FirebaseNotifier $firebaseNotifier, private string $webAppUrl)
    {
    }

    public function sendAppointmentConfirmNotification(Appointment $appointment): void
    {
        $notification = new Notification(
            recipient: $appointment->customer,
            title: 'Demande de RDV acceptée',
            body: sprintf('Votre demande de RDV du %s a été confirmée', $appointment->slotTime->format('d-m-Y H:i')),
            params: [
                'route' => sprintf('%s/rendez-vous/mes-rendez-vous', $this->webAppUrl)
            ]
        );

        $this->firebaseNotifier->sendNotification($notification);
    }
}
