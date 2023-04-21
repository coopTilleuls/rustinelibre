<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use App\Entity\Repairer;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
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
        $this->updateSlug('persist', $args);
    }

    public function preUpdate(BaseLifecycleEventArgs $args): void
    {
        $this->updateSlug('update', $args);
    }

    private function updateSlug(string $action, LifecycleEventArgs $args): void
    {
        $repairer = $args->getObject();

        if (!$repairer instanceof Repairer) {
            return;
        }

        $slug = (string) $this->slugger->slug($repairer->name);
        $repairer->slug = $slug;
    }
}
