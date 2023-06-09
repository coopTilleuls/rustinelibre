<?php

declare(strict_types=1);

namespace App\User\EventSubscriber;

use App\Entity\User;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs as BaseLifecycleEventArgs;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class HashPasswordSubscriber implements EventSubscriber
{
    public function __construct(private readonly UserPasswordHasherInterface $userPasswordHasher, private readonly RequestStack $requestStack)
    {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::prePersist,
            Events::preUpdate,
        ];
    }

    public function prePersist(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof User) {
            return;
        }

        $this->hashPassword($entity);
    }

    public function preUpdate(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof User) {
            return;
        }

        if ('auth' == $this->requestStack->getCurrentRequest()->attributes->get('_route')) {
            return;
        }

        $this->hashPassword($entity);
    }

    private function hashPassword(User $user): void
    {
        if (!$user->plainPassword) {
            return;
        }

        /** @var string $plainPassword */
        $plainPassword = $user->plainPassword;
        $hashedPassword = $this->userPasswordHasher->hashPassword($user, $plainPassword);
        $user->password = $hashedPassword;
    }
}
