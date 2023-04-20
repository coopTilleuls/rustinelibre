<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use App\Entity\Repairer;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs as BaseLifecycleEventArgs;
use Symfony\Component\String\Slugger\SluggerInterface;

readonly class SlugEventSubscriber implements EventSubscriber
{
    public function __construct(private SluggerInterface $slugger)
    {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::preUpdate,
        ];
    }

    public function prePersist(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();
        if (!$entity instanceof Repairer) {
            return;
        }

        $this->updateSlug($entity);
    }

    public function preUpdate(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof Repairer) {
            return;
        }

        $this->updateSlug($entity);
    }

    private function updateSlug(Repairer $repairer): void
    {
        $slug = (string) $this->slugger->slug($repairer->name);
        $repairer->slug = $slug;
    }
}
