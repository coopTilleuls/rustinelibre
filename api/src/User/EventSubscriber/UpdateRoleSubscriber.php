<?php

declare(strict_types=1);

namespace App\User\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\KernelEvents;

final readonly class UpdateRoleSubscriber implements EventSubscriberInterface
{
    public function __construct(private Security $security)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['updateRoles', EventPriorities::PRE_WRITE],
        ];
    }

    public function updateRoles(ViewEvent $event): void
    {
        $user = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$user instanceof User || Request::METHOD_PUT !== $method) {
            return;
        }

        $contentRequest = json_decode($event->getRequest()->getContent(), true);
        if (!array_key_exists('roles', $contentRequest) || !is_array($contentRequest['roles'])) {
            return;
        }

        // If a non-admin try to update roles to admin
        if (in_array('ROLE_ADMIN', $contentRequest['roles']) && !$this->security->isGranted('ROLE_ADMIN')) {
            throw new AccessDeniedHttpException();
        }

        if (in_array('ROLE_ADMIN', $contentRequest['roles'])) {
            $user->addRole('ROLE_ADMIN');
        }

        if (in_array('ROLE_USER', $contentRequest['roles'])) {
            $user->addRole('ROLE_USER');
        }
    }
}
