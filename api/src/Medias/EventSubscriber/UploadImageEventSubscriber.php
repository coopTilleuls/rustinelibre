<?php

declare(strict_types=1);

namespace App\Medias\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\MediaObject;
use App\Flysystem\ImageManager;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final class UploadImageEventSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private ImageManager $imagesStorage,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['uploadImage', EventPriorities::PRE_WRITE],
        ];
    }

    public function uploadImage(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof MediaObject || Request::METHOD_POST !== $method) {
            return;
        }

        $object->filePath = sprintf('%d-%s', time(), $object->file->getClientOriginalName());
        $this->imagesStorage->uploadImage($object);
    }
}
