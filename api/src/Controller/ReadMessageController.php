<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Discussion;
use App\Entity\User;
use App\Repository\DiscussionMessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
readonly class ReadMessageController
{
    public function __construct(
        private DiscussionMessageRepository $discussionMessageRepository,
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    /**
     * Switch all unread messages from a discussion to "read" status.
     */
    public function __invoke(Discussion $discussion): ?JsonResponse
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (0 < $this->discussionMessageRepository->getNumberOfMessageNotReadForDiscussion(discussion: $discussion, user: $user)) {
            $this->discussionMessageRepository->setReadByDiscussionAndUser(discussion: $discussion, user: $user);

            if ($discussion->lastMessage) {
                // Here we just add 1 second to our lastMessage datetime to trigger mercure event
                $newDateTime = $discussion->lastMessage->modify('+1 second');
                $discussion->lastMessage = $newDateTime;
                $this->entityManager->flush();
            }
        }

        return new JsonResponse();
    }
}
