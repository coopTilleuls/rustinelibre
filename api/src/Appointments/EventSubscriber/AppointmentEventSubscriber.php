<?php

declare(strict_types=1);

namespace App\Appointments\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Appointment;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class AppointmentEventSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly FirstSlotAvailableCalculator $firstSlotAvailableCalculator,
    ) {
    }

    public function postWrite(ViewEvent $event): void
    {
        $entity = $event->getControllerResult();

        if (!$entity instanceof Appointment) {
            return;
        }

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($entity->getRepairer());
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => [
                ['postWrite', EventPriorities::POST_WRITE],
            ],
        ];
    }
}
