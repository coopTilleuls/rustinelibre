<?php

declare(strict_types=1);

namespace App\Bike\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Bike;
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

        if (!$object instanceof Bike || Request::METHOD_PUT !== $method) {
            return;
        }

        $originalEntity = $this->entityManager->getUnitOfWork()->getOriginalEntityData($object);

        if (array_key_exists('picture_id', $originalEntity)
            && $originalEntity['picture_id']
            && $object->picture
            && $object->picture->id
            && $originalEntity['picture_id'] !== $object->picture->id
        ) {
            $this->mediaObjectRepository->remove($this->mediaObjectRepository->find($originalEntity['picture_id']));
        }

        if (array_key_exists('wheel_picture_id', $originalEntity)
            && $originalEntity['wheel_picture_id']
            && $object->wheelPicture
            && $object->wheelPicture->id
            && $originalEntity['wheel_picture_id'] !== $object->wheelPicture->id
        ) {
            $this->mediaObjectRepository->remove($this->mediaObjectRepository->find($originalEntity['wheel_picture_id']));
        }

        if (array_key_exists('transmission_picture_id', $originalEntity)
            && $originalEntity['transmission_picture_id']
            && $object->transmissionPicture
            && $object->transmissionPicture->id
            && $originalEntity['transmission_picture_id'] !== $object->transmissionPicture->id
        ) {
            $this->mediaObjectRepository->remove($this->mediaObjectRepository->find($originalEntity['transmission_picture_id']));
        }
    }
}
