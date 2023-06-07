<?php

declare(strict_types=1);

namespace App\Messages\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\DiscussionMessage;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class InjectSenderEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private Security $security)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['injectSender', EventPriorities::PRE_WRITE],
        ];
    }

    public function injectSender(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof DiscussionMessage || Request::METHOD_POST !== $method) {
            return;
        }

        /** @var User $currentUser */
        $currentUser = $this->security->getUser();
        $object->sender = $currentUser;
    }
}
