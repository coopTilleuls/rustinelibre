<?php

declare(strict_types=1);

namespace App\Employees\EventSubscriber;

use App\Emails\NewAccountEmail;
use App\Entity\RepairerEmployee;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs as BaseLifecycleEventArgs;

#[AsDoctrineListener(event: Events::postPersist)]
final class EmployeeSendPasswordEventSubscriber
{
    public function __construct(private readonly NewAccountEmail $newAccountEmail)
    {
    }

    public function postPersist(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof RepairerEmployee) {
            return;
        }

        $userEmployee = $entity->employee;
        $this->newAccountEmail->sendConfirmationEmail(userEmployee: $userEmployee, repairer: $entity->repairer);
        $userEmployee->eraseCredentials();
    }
}
