<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Repairer;
use App\Repository\MediaObjectRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class RemoveMediaObjectEventSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private MediaObjectRepository $mediaObjectRepository
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['removeMediaObject', EventPriorities::PRE_WRITE],
        ];
    }

    public function removeMediaObject(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof Repairer || Request::METHOD_PUT !== $method) {
            return;
        }

        $originalEntity = $this->entityManager->getUnitOfWork()->getOriginalEntityData($object);

        if (array_key_exists('thumbnail_id', $originalEntity) && $object->thumbnail && $originalEntity['thumbnail_id'] !== $object->thumbnail->id) {
            $this->mediaObjectRepository->remove($this->mediaObjectRepository->find($originalEntity['thumbnail_id']));
        }

        if (array_key_exists('description_picture_id', $originalEntity) && $object->descriptionPicture && $originalEntity['description_picture_id'] !== $object->descriptionPicture->id) {
            $this->mediaObjectRepository->remove($this->mediaObjectRepository->find($originalEntity['description_picture_id']));
        }
    }
}
