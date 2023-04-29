<?php

declare(strict_types=1);

namespace App\Medias\EventSubscriber;

use App\Entity\MediaObject;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;
use League\Flysystem\FilesystemOperator;

final class RemoveFileEventSubscriber implements EventSubscriber
{
    public function __construct(private FilesystemOperator $defaultStorage)
    {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::postRemove,
        ];
    }

    public function postRemove(LifecycleEventArgs $args): void
    {
        $media = $args->getObject();
        if (!$media instanceof MediaObject) {
            return;
        }

        if ($this->defaultStorage->has($media->filePath)) {
            $this->defaultStorage->delete($media->filePath);
        }
    }
}
