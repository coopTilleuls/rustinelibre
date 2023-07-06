<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Entity\Appointment;

final readonly class NewAppointmentNotification
{
    public function __construct(private FirebaseNotifier $firebaseNotifier, private string $webAppUrl)
    {
    }

    public function sendNewAppointmentNotification(Appointment $appointment): void
    {
        $notification = new Notification(
            recipient: $appointment->repairer->owner,
            title: 'Nouvelle demande de RDV',
            body: $appointment->slotTime->format('d-m-Y H:i'),
            params: [
                'route' => sprintf('%s/sradmin?appointment=%s', $this->webAppUrl, $appointment->id),
            ]
        );

        $this->firebaseNotifier->sendNotification($notification);
    }
}
