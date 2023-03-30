<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use App\Entity\Repairer;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

final class GpsPointEventSubscriber implements EventSubscriber
{
    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
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
        $this->updateGpsCoordinates('persist', $args);
    }

    public function preUpdate(LifecycleEventArgs $args): void
    {
        $this->updateGpsCoordinates('update', $args);
    }

    private function updateGpsCoordinates(string $action, LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof Repairer) {
            return;
        }

        $changeSet = $this->entityManager->getUnitOfWork()->getEntityChangeSet($entity);
        if (('update' === $action && !array_key_exists('latitude', $changeSet) && !array_key_exists('longitude', $changeSet))
            || !$entity->getLongitude() || !$entity->getLatitude()) {
            return;
        }

        $entity->setGpsPoint(sprintf(
            'POINT(%s %s)',
            $entity->getLatitude(),
            $entity->getLongitude()
        ));
    }
}
