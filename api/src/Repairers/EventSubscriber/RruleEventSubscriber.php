<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use App\Entity\Repairer;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class RruleEventSubscriber implements EventSubscriber
{
    public function __construct(
        private readonly FirstSlotAvailableCalculator $firstSlotAvailableCalculator,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::preUpdate,
        ];
    }

    public function prePersist(LifecycleEventArgs $args): void
    {
        $this->updateFirstSlot('persist', $args);
    }

    public function preUpdate(LifecycleEventArgs $args): void
    {
        $this->updateFirstSlot('update', $args);
    }

    public function updateFirstSlot(string $action, LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof Repairer) {
            return;
        }

        $changeSet = $this->entityManager->getUnitOfWork()->getEntityChangeSet($entity);

        // Dont set next available slot if rrule does not change, or if at creation a first slot was already set
        if (('update' === $action && !array_key_exists('rrule', $changeSet)) ||
            ('persist' === $action && $entity->getFirstSlotAvailable())) {
            return;
        }

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($entity);
    }
}
