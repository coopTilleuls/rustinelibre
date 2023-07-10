<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Discussion;
use App\Entity\User;
use App\Repository\DiscussionMessageRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
readonly class SetReadMessageController
{
    public function __construct(
        private DiscussionMessageRepository $discussionMessageRepository,
        private Security $security,
    ) {
    }

    public function __invoke(Discussion $discussion): ?Response
    {
        /** @var User $user */
        $user = $this->security->getUser();
        $this->discussionMessageRepository->setReadByDiscussionAndUser($discussion, $user);

        return new Response(null, Response::HTTP_OK);
    }
}
