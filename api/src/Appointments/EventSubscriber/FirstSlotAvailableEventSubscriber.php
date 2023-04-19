<?php

declare(strict_types=1);

namespace App\Appointments\EventSubscriber;

use App\Entity\Appointment;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class FirstSlotAvailableEventSubscriber implements EventSubscriber
{
    public function __construct(
        private readonly FirstSlotAvailableCalculator $firstSlotAvailableCalculator,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function getSubscribedEvents()
    {
        return [
            Events::preRemove,
            Events::prePersist,
            Events::preUpdate,
        ];
    }

    public function preRemove(LifecycleEventArgs $args)
    {
        $this->calculateFirstSlotAvailable('remove', $args);
    }

    public function prePersist(LifecycleEventArgs $args)
    {
        $this->calculateFirstSlotAvailable('persist', $args);
    }

    public function preUpdate(LifecycleEventArgs $args)
    {
        $this->calculateFirstSlotAvailable('update', $args);
    }

    private function calculateFirstSlotAvailable(string $action, LifecycleEventArgs $args)
    {
        $entity = $args->getObject();

        if (!$entity instanceof Appointment) {
            return;
        }

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($entity->repairer);
    }
}
