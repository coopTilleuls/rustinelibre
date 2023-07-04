<?php

declare(strict_types=1);

namespace App\Medias\EventSubscriber;

use App\Entity\MediaObject;
use App\Flysystem\MediaObjectManager;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

final readonly class RemoveFileEventSubscriber implements EventSubscriber
{
    public function __construct(
        private MediaObjectManager $mediaObjectManager,
    ) {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::preRemove,
        ];
    }

    public function preRemove(LifecycleEventArgs $args): void
    {
        $media = $args->getObject();
        if (!$media instanceof MediaObject) {
            return;
        }

        $prefix = $this->mediaObjectManager->getPrefixOfMediaObject($media);
        if (!$prefix) {
            return;
        }

        $this->mediaObjectManager->getOperator($prefix)->delete($media->filePath);
    }
}
