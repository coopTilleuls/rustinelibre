<?php

declare(strict_types=1);

namespace App\Messages\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Appointment;
use App\Entity\Discussion;
use App\Repository\DiscussionRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class CreateDiscussionEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private DiscussionRepository $discussionRepository)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['createDiscussion', EventPriorities::POST_WRITE],
        ];
    }

    public function createDiscussion(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

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
