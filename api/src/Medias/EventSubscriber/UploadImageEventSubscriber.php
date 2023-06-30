<?php

declare(strict_types=1);

namespace App\Medias\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\MediaObject;
use App\Flysystem\FileManager;
use App\Flysystem\ImageManager;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\String\Slugger\SluggerInterface;

final class UploadImageEventSubscriber implements EventSubscriberInterface
{
    private const IMAGE_MIME_TYPES = [
        'image/png',
        'image/jpeg',
    ];

    public function __construct(
        private ImageManager $imagesStorage,
        private FileManager $fileManager,
        private SluggerInterface $slugger
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['uploadMediaObject', EventPriorities::PRE_WRITE],
        ];
    }

    public function uploadMediaObject(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof MediaObject || Request::METHOD_POST !== $method || !$object->file instanceof UploadedFile) {
            return;
        }

        $parts = explode('.', $object->file->getClientOriginalName());
        $slugName = (string) $this->slugger->slug(strtolower($parts[0]));
        $object->filePath = sprintf('%d-%s.%s', time(), $slugName, $parts[1]);

        in_array($object->file->getMimeType(), self::IMAGE_MIME_TYPES, true) ?
            $this->imagesStorage->uploadImage($object) :
            $this->fileManager->uploadFile($object);
    }
}
