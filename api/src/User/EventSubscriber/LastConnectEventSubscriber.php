<?php

declare(strict_types=1);

namespace App\User\EventSubscriber;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Security\Http\Event\InteractiveLoginEvent;

class LastConnectEventSubscriber implements EventSubscriberInterface
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    public function onLoginSuccess(InteractiveLoginEvent $event): void
    {
        $user = $event->getAuthenticationToken()->getUser();

        if (!$user instanceof User) {
            return;
        }

        $user->lastConnect = new \DateTime('', new \DateTimeZone('Europe/Paris'));

        $this->entityManager->persist($user);
        $this->entityManager->flush();
    }

    public static function getSubscribedEvents()
    {
        return [
            'security.interactive_login' => 'onLoginSuccess',
        ];
    }
}
