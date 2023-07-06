<?php

declare(strict_types=1);

namespace App\Tests\Discussion\Controller;

use App\Entity\Discussion;
use App\Repository\DiscussionMessageRepository;
use App\Repository\DiscussionRepository;
use App\Tests\AbstractTestCase;

class SetReadMessageControllerTest extends AbstractTestCase
{
    private DiscussionRepository $discussionRepository;
    private DiscussionMessageRepository $discussionMessageRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->discussionRepository = self::getContainer()->get(DiscussionRepository::class);
        $this->discussionMessageRepository = self::getContainer()->get(DiscussionMessageRepository::class);
    }

    public function testSetReadMessage(): void
    {
        $discussion = $this->discussionRepository->findOneBy([]);
        $messagesBeforeSetRead = $this->getMessageForDiscussion($discussion);
        foreach ($messagesBeforeSetRead as $message) {
            self::assertFalse($message->alreadyRead);
        }

        $this->createClientWithUser($discussion->customer)->request('GET', sprintf('/discussions/%d/set_read', $discussion->id));
        self::assertResponseIsSuccessful();

        $messagesAfterSetRead = $this->getMessageForDiscussion($discussion);
        foreach ($messagesAfterSetRead as $message) {
            self::assertTrue($message->alreadyRead);
        }
    }

    private function getMessageForDiscussion(Discussion $discussion): array
    {
        $messages = $this->discussionMessageRepository->findBy(['discussion' => $discussion]);

        return array_filter($messages, static function ($message) use ($discussion) {
            return $message->sender !== $discussion->customer;
        });
    }
}
