<?php

declare(strict_types=1);

namespace App\Employees\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use ApiPlatform\Validator\ValidatorInterface;
use App\Entity\Repairer;
use App\Entity\RepairerEmployee;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\KernelEvents;

final class EmployeeEventSubscriber implements EventSubscriberInterface
{
    private Security $security;
    private ValidatorInterface $validator;

    public function __construct(Security $security, ValidatorInterface $validator)
    {
        $this->security = $security;
        $this->validator = $validator;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['assignRepairer', EventPriorities::PRE_VALIDATE],
        ];
    }

    public function assignRepairer(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof RepairerEmployee || Request::METHOD_POST !== $method) {
            return;
        }

        /** @var User|null $user */
        $user = $this->security->getUser();

        // if ($user->isAdmin()) {
        //     return;
        // }

        // $currentRepairer = $user->getRepairer();
        // if (!$currentRepairer) {
        //     throw new BadRequestHttpException('Your user is')
        // }

        $object->setRepairer($user);
        $this->validator->validate($object);
    }
}