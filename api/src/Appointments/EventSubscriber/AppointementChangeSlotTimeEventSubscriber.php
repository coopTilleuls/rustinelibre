<?php

declare(strict_types=1);

namespace App\Appointments\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Emails\AppointmentChangeTimeEmail;
use App\Entity\Appointment;
use App\Notifications\AppointmentChangeTimeNotification;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class AppointementChangeSlotTimeEventSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private AppointmentChangeTimeEmail $appointmentChangeTimeEmail,
        private AppointmentChangeTimeNotification $appointmentChangeTimeNotification
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['changeSlotTime', EventPriorities::PRE_WRITE],
        ];
    }

    public function changeSlotTime(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof Appointment || Request::METHOD_PUT !== $method) {
            return;
        }

        $originalEntity = $this->entityManager->getUnitOfWork()->getOriginalEntityData($object);
        if (!array_key_exists('slotTime', $originalEntity) || $originalEntity['slotTime'] === $object->slotTime) {
            return;
        }

        $this->appointmentChangeTimeEmail->sendChangeTimeEmail($object, $originalEntity['slotTime']->format('d/m/Y H:i'));
        $this->appointmentChangeTimeNotification->sendAppointmentChangeTimeNotification($object, $originalEntity['slotTime']->format('d/m/Y H:i'));
    }
}
