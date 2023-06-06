<?php

declare(strict_types=1);

namespace App\Messages\EventSubscriber;

use App\Entity\Appointment;
use App\Entity\Discussion;
use App\Repository\DiscussionRepository;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs as BaseLifecycleEventArgs;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;

readonly class CreateDiscussionEventSubscriber implements EventSubscriber
{
    public function __construct(private DiscussionRepository $discussionRepository, private RequestStack $requestStack)
    {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
        ];
    }

    public function postPersist(BaseLifecycleEventArgs $args): void
    {
        $object = $args->getObject();
        $method = $this->requestStack->getCurrentRequest()->getMethod();

        if (!$object instanceof Appointment || Request::METHOD_POST !== $method) {
            return;
        }

        $discussion = $this->discussionRepository->findOneBy(['customer' => $object->customer, 'repairer' => $object->repairer]);
        if ($discussion) {
            return;
        }

        $discussion = new Discussion();
        $discussion->repairer = $object->repairer;
        $discussion->customer = $object->customer;
        $this->discussionRepository->save($discussion, true);
    }
}
