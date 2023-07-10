<?php

declare(strict_types=1);

namespace App\Tests\Discussion\Controller;

use App\Repository\DiscussionMessageRepository;
use App\Repository\DiscussionRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;

class NumberOfMessageNotReadForDiscussionControllerTest extends AbstractTestCase
{
    private DiscussionRepository $discussionRepository;
    private DiscussionMessageRepository $discussionMessageRepository;
    private UserRepository $userRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->discussionRepository = self::getContainer()->get(DiscussionRepository::class);
        $this->discussionMessageRepository = self::getContainer()->get(DiscussionMessageRepository::class);
        $this->userRepository = self::getContainer()->get(UserRepository::class);
    }

    public function testGetNumberOfMessageNotReadForDiscussion(): void
    {
        $user = $this->userRepository->findOneBy(['email' => 'user1@test.com']);
        $discussion = $this->discussionRepository->findOneBy(['customer' => $user]);
        $messages = $this->discussionMessageRepository->findBy(['discussion' => $discussion]);
        $notRead = count(array_filter($messages, static function ($message) use ($user) {
            return $message->sender !== $user && !$message->alreadyRead;
        }));

        $response = $this->createClientWithUser($discussion->customer)->request('GET', sprintf('/messages_unread/%s', $discussion->id))->toArray();
        self::assertResponseIsSuccessful();
        self::assertArrayHasKey('count', $response);
        self::assertSame($response['count'], $notRead);
    }
}
