<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Discussion;
use App\Entity\User;
use App\Repository\DiscussionMessageRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
readonly class NumberOfMessageNotReadForDiscussionController
{
    public function __construct(
        private DiscussionMessageRepository $discussionMessageRepository,
        private Security $security,
    ) {
    }

    public function __invoke(Discussion $discussion): JsonResponse
    {
        /** @var User $user */
        $user = $this->security->getUser();

        return new JsonResponse(['count' => $this->discussionMessageRepository->getNumberOfMessageNotReadForDiscussion($discussion, $user)]);
    }
}
