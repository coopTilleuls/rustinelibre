<?php

declare(strict_types=1);

namespace App\Maintenance\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Maintenance;
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

        if (!$object instanceof Maintenance || Request::METHOD_PUT !== $method) {
            return;
        }

        $originalEntity = $this->entityManager->getUnitOfWork()->getOriginalEntityData($object);

        if (array_key_exists('photo_id', $originalEntity)
            && $originalEntity['photo_id']
            && $object->photo
            && $object->photo->id
            && $originalEntity['photo_id'] !== $object->photo->id
        ) {
            $this->mediaObjectRepository->remove($this->mediaObjectRepository->find($originalEntity['photo_id']));
        }

        if (array_key_exists('invoice_id', $originalEntity)
            && $originalEntity['invoice_id']
            && $object->invoice
            && $object->invoice->id
            && $originalEntity['invoice_id'] !== $object->invoice->id
        ) {
            $this->mediaObjectRepository->remove($this->mediaObjectRepository->find($originalEntity['invoice_id']));
        }
    }
}
