<?php

declare(strict_types=1);

namespace App\Messages\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Messages\Dto\NumberOfMessageNotReadDto;
use App\Messages\Dto\NumberOfMessageNotReadForDiscussionDto;
use App\Repository\DiscussionMessageRepository;
use App\Repository\DiscussionRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

readonly class NumberOfMessageNotReadProvider implements ProviderInterface
{
    public function __construct(
        private DiscussionMessageRepository $discussionMessageRepository,
        private DiscussionRepository $discussionRepository,
        private Security $security,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedException();
        }

        if (array_key_exists('id', $uriVariables)) {
            $notRead = $this->discussionMessageRepository->getNumberOfMessageNotReadForDiscussion($id = (int) $uriVariables['id'], $user);

            return new NumberOfMessageNotReadForDiscussionDto($this->discussionRepository->find($id), $notRead);
        }

        $notRead = $this->discussionMessageRepository->getNumberOfMessageNotReadByDiscussion($user);
        $forDiscussion = array_map(function ($item) {
            return new NumberOfMessageNotReadForDiscussionDto($this->discussionRepository->find($item['discussion_id']), $item['not_read']);
        }, $notRead);

        return new NumberOfMessageNotReadDto($forDiscussion);
    }
}
