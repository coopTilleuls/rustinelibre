<?php

declare(strict_types=1);

namespace App\Contact\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Emails\NewContactEmail;
use App\Entity\Contact;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class ContactEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private NewContactEmail $newContactEmail)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['sendContactMail', EventPriorities::POST_WRITE],
        ];
    }

    public function sendContactMail(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof Contact || Request::METHOD_POST !== $method) {
            return;
        }

        $this->newContactEmail->sendNewContactEmail(contact: $object);
    }
}
