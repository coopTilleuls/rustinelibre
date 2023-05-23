<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RepairerOrderByFirstSlotAvailableEventSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['orderByFirstSlotAvailable', EventPriorities::POST_READ],
        ];
    }

    public function orderByFirstSlotAvailable(ViewEvent $event): void
    {
        $data = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();
        dd('test');
    }
}
