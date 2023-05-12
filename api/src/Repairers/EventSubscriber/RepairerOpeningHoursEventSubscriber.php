<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\RepairerOpeningHours;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class RepairerOpeningHoursEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private Security $security)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => [
                ['injectCustomer', EventPriorities::PRE_WRITE],
            ],
        ];
    }

    public function injectCustomer(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof RepairerOpeningHours || Request::METHOD_POST !== $method) {
            return;
        }

        /** @var User $currentUser */
        $currentUser = $this->security->getUser();

        if ($currentUser->isAdmin() && $object->repairer) {
            return;
        }

        $object->repairer = $currentUser->repairer;
    }
}
