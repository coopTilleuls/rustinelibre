<?php

declare(strict_types=1);

namespace App\Bike\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Bike;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class BikeOwnerEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private readonly Security $security)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['injectOwner', EventPriorities::PRE_WRITE],
        ];
    }

    public function linkRepairerToAdminIntervention(ViewEvent $event): void
    {
        $object = $event->getControllerResult();

        if (!$object instanceof Bike) {
            return;
        }

        $object->owner = $this->security->getUser();
    }
}
