<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Emails\NewRepairerEmail;
use App\Entity\Repairer;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

final readonly class RepairerEnabledEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private EntityManagerInterface $entityManager, private NewRepairerEmail $newRepairerEmail)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['enableRepairer', EventPriorities::PRE_WRITE],
        ];
    }

    public function enableRepairer(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof Repairer || Request::METHOD_PUT !== $method) {
            return;
        }

        $originalEntity = $this->entityManager->getUnitOfWork()->getOriginalEntityData($object);

        if (array_key_exists('enabled', $originalEntity) && false === $originalEntity['enabled'] && true === $object->enabled) {
            $object->owner->emailConfirmed = true;
            $this->newRepairerEmail->sendRepairerValidationEmail($object);
        }
    }
}
