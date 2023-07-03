<?php

declare(strict_types=1);

namespace App\Medias\EventSubscriber;

use App\Entity\MediaObject;
use App\Flysystem\FileManager;
use App\Flysystem\ImageManager;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

final readonly class RemoveFileEventSubscriber implements EventSubscriber
{
    public function __construct(
        private ImageManager $imageManager,
        private FileManager $fileManager,
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

        if ($this->imageManager->getOperator()->fileExists($media->filePath)) {
            $this->imageManager->getOperator()->delete($media->filePath);
        } elseif ($this->fileManager->getOperator()->fileExists($media->filePath)) {
            $this->fileManager->getOperator()->delete($media->filePath);
        }
    }
}
