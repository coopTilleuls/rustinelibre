<?php

declare(strict_types=1);

namespace App\Medias\EventSubscriber;

use App\Entity\MediaObject;
use App\Flysystem\MediaObjectManager;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

#[AsDoctrineListener(event: Events::preRemove)]
final readonly class RemoveFileEventSubscriber
{
    public function __construct(
        private MediaObjectManager $mediaObjectManager,
    ) {
    }

    public function preRemove(LifecycleEventArgs $args): void
    {
        $media = $args->getObject();
        if (!$media instanceof MediaObject) {
            return;
        }

        $prefix = $this->mediaObjectManager->getPrefixOfMediaObject(mediaObject: $media);
        if (!$prefix) {
            return;
        }

        $this->mediaObjectManager->getOperator($prefix)->delete($media->filePath);
    }
}
