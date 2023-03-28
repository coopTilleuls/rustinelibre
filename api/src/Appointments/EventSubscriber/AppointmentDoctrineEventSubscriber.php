<?php

declare(strict_types=1);

namespace App\Appointments\EventSubscriber;

use App\Entity\Appointment;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use Doctrine\Common\EventSubscriber;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\ORM\Events;

class AppointmentDoctrineEventSubscriber implements EventSubscriber
{
    public function __construct(
        private readonly FirstSlotAvailableCalculator $firstSlotAvailableCalculator,
    ) {
    }

    public function getSubscribedEvents()
    {
        return [
            Events::postRemove,
        ];
    }

    public function postRemove(LifecycleEventArgs $args)
    {
        $entity = $args->getObject();

        if (!$entity instanceof Appointment) {
            return;
        }

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($entity->getRepairer());
    }
}
