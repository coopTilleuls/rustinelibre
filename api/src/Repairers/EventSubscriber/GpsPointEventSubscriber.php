<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use App\Entity\Repairer;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::preUpdate)]
final class GpsPointEventSubscriber
{
    public function __construct(private readonly EntityManagerInterface $entityManager)
    {
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
            || !$entity->longitude || !$entity->latitude) {
            return;
        }

        $entity->gpsPoint = sprintf(
            'POINT(%s %s)',
            $entity->latitude,
            $entity->longitude
        );
    }
}
