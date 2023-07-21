<?php

declare(strict_types=1);

namespace App\User\EventSubscriber;

use App\Emails\ValidationCodeEmail;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs as BaseLifecycleEventArgs;

#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::postPersist)]
final class ValidationCodeSubscriber
{
    public function __construct(private ValidationCodeEmail $validationCodeEmail)
    {
    }

    public function prePersist(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof User || $entity->isEmployee()) {
            return;
        }

        $entity->validationCode = random_int(1000, 9999);
    }

    public function postPersist(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof User || $entity->isEmployee()) {
            return;
        }

        $this->validationCodeEmail->sendValidationCodeEmail(user: $entity);
    }
}
