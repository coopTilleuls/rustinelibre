<?php

declare(strict_types=1);

namespace App\User\EventSubscriber;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs as BaseLifecycleEventArgs;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsDoctrineListener(event: Events::prePersist, priority: 500, connection: 'default')]
final readonly class HashPasswordSubscriber
{
    public function __construct(private UserPasswordHasherInterface $userPasswordHasher)
    {
    }

    public function prePersist(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof User) {
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
