<?php

declare(strict_types=1);

namespace App\User\EventSubscriber;

use App\Entity\User;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

class LastConnectEventSubscriber implements EventSubscriberInterface
{

    public function onLoginSuccess(InteractiveLoginEvent $event): void
    {
        $user = $event->getAuthenticationToken()->getUser();

        if (!$user instanceof User)
        {
            return;
        }

        $user->lastConnect = new \DateTime();
    }

    public static function getSubscribedEvents()
    {
        return [
            'security.interactive_login' => 'onLoginSuccess',
        ];
    }
}
