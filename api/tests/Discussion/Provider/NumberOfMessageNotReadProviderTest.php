<?php

declare(strict_types=1);

namespace App\Tests\Discussion\Provider;

use App\Repository\DiscussionRepository;
use App\Tests\AbstractTestCase;

class NumberOfMessageNotReadProviderTest extends AbstractTestCase
{
    private DiscussionRepository $discussionRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->discussionRepository = self::getContainer()->get(DiscussionRepository::class);
    }

    public function testGetNumberOfMessageNotReadForDiscussion(): void
    {
        $discussion = $this->discussionRepository->findOneBy([]);
        $response = $this->createClientWithUser($discussion->customer)->request('GET', sprintf('/number_of_message_not_read/%s', $discussion->id))->toArray();
        self::assertResponseIsSuccessful();
        self::assertArrayHasKey('notRead', $response);
        self::assertSame($response['notRead'], 5);
    }

    public function testGetNumberOfMessageNotReadForEachDiscussion(): void
    {
        $discussion = $this->discussionRepository->findOneBy([]);
        $response = $this->createClientWithUser($discussion->customer)->request('GET', '/number_of_message_not_read')->toArray();
        self::assertResponseIsSuccessful();
        self::assertArrayHasKey('numberOfMessageNotReadByDiscussion', $response);

        // check message not read for first discussion
        self::assertArrayHasKey('notRead', $response['numberOfMessageNotReadByDiscussion'][0]);
        self::assertSame($response['numberOfMessageNotReadByDiscussion'][0]['notRead'], 5);

        // check message not read for second discussion
        self::assertArrayHasKey('notRead', $response['numberOfMessageNotReadByDiscussion'][1]);
        self::assertSame($response['numberOfMessageNotReadByDiscussion'][1]['notRead'], 5);
    }
}
