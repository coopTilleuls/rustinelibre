<?php

declare(strict_types=1);

namespace App\Messages\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\DiscussionMessage;
use App\Repository\DiscussionRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class UpdateDiscussionLastMessageEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private DiscussionRepository $discussionRepository)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['updateDiscussion', EventPriorities::POST_WRITE],
        ];
    }

    public function updateDiscussion(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof DiscussionMessage || Request::METHOD_POST !== $method) {
            return;
        }

        $discussion = $object->discussion;
        $discussion->lastMessage = new \DateTimeImmutable('now');
        $this->discussionRepository->save($discussion, true);
    }
}
