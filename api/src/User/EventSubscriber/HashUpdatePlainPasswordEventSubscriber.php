<?php

declare(strict_types=1);

namespace App\User\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final readonly class HashUpdatePlainPasswordEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private UserPasswordHasherInterface $userPasswordHasher)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['hashPassword', EventPriorities::PRE_WRITE],
        ];
    }

    public function hashPassword(ViewEvent $event): void
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ('auth' == $event->getRequest()->attributes->get('_route')) {
            return;
        }
        if (!$user instanceof User || !$user->plainPassword || Request::METHOD_PUT !== $method) {
            return;
        }

        $user->password = $this->userPasswordHasher->hashPassword($user, $user->plainPassword);
    }
}
