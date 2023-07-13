<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use App\Entity\Repairer;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use Doctrine\Persistence\Event\LifecycleEventArgs as BaseLifecycleEventArgs;
use Symfony\Component\String\Slugger\SluggerInterface;

#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::preUpdate)]
readonly class SlugEventSubscriber
{
    public function __construct(private SluggerInterface $slugger)
    {
    }

    public function prePersist(BaseLifecycleEventArgs $args): void
    {
        $this->updateSlug(args: $args);
    }

    public function preUpdate(BaseLifecycleEventArgs $args): void
    {
        $this->updateSlug(args: $args);
    }

    private function updateSlug(LifecycleEventArgs $args): void
    {
        $repairer = $args->getObject();

        if (!$repairer instanceof Repairer) {
            return;
        }

        $slug = (string) $this->slugger->slug(strtolower($repairer->name));
        $repairer->slug = $slug;
    }
}
