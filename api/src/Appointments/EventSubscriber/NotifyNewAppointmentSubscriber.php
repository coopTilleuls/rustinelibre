<?php

declare(strict_types=1);

namespace App\Appointments\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Emails\NewAppointmentEmail;
use App\Entity\Appointment;
use App\Notifications\NewAppointmentNotification;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class NotifyNewAppointmentSubscriber implements EventSubscriberInterface
{
    public function __construct(private NewAppointmentEmail $newAppointmentEmail, private NewAppointmentNotification $newAppointmentNotification)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['notifyRepairer', EventPriorities::POST_WRITE],
        ];
    }

    public function notifyRepairer(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof Appointment || Request::METHOD_POST !== $method) {
            return;
        }

        $this->newAppointmentEmail->sendNewAppointmentEmail(appointment: $object);
        $this->newAppointmentNotification->sendNewAppointmentNotification(appointment: $object);
    }
}
