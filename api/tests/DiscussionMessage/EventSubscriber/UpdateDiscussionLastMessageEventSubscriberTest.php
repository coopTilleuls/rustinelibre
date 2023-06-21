<?php

declare(strict_types=1);

namespace App\Tests\DiscussionMessage\EventSubscriber;

use App\Repository\DiscussionMessageRepository;
use App\Tests\DiscussionMessage\DiscussionMessageAbstractTestCase;

class UpdateDiscussionLastMessageEventSubscriberTest extends DiscussionMessageAbstractTestCase
{
    private DiscussionMessageRepository $discussionMessageRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->discussionMessageRepository = self::getContainer()->get(DiscussionMessageRepository::class);
    }

    public function testLastMessageIsUpdatedAfterByNewMessage(): void
    {
        $customer = $this->userRepository->getUserWithRole('ROLE_USER');
        $repairer = $this->repairerRepository->findOneBy([]);
        $discussion = $this->getDiscussionWithRepairerAndCustomer($repairer, $customer);

        $messageResponse = $this->createClientWithUser($customer)->request('POST', '/discussion_messages', [
            'json' => [
                'discussion' => sprintf('/discussions/%s', $discussion->id),
                'content' => 'Hello',
            ],
        ])->toArray();
        self::assertResponseIsSuccessful();
        $this->discussionMessageRepository = self::getContainer()->get(DiscussionMessageRepository::class);
        self::assertNotSame($discussion->lastMessage, $this->discussionMessageRepository->find($messageResponse['id'])->discussion->lastMessage);
    }
}
