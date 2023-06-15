<?php

declare(strict_types=1);

namespace App\Tests\DiscussionMessage\Security;

use App\Tests\DiscussionMessage\DiscussionMessageAbstractTestCase;

class PostTest extends DiscussionMessageAbstractTestCase
{
    public function testCustomerCanAddMessageInHisDiscussion(): void
    {
        $customer = $this->userRepository->getUserWithRole('ROLE_USER');
        $repairer = $this->repairerRepository->findOneBy([]);
        $discussion = $this->getDiscussionWithRepairerAndCustomer($repairer, $customer);

        self::assertResponseIsSuccessful();

        $this->createClientWithUser($customer)->request('POST', '/discussion_messages', [
            'json' => [
                'discussion' => sprintf('/discussions/%s', $discussion->id),
                'content' => 'Hello',
            ],
        ]);
        self::assertResponseIsSuccessful();
    }

    public function testRepairerCanAddMessageInHisDiscussion(): void
    {
        $customer = $this->userRepository->getUserWithRole('ROLE_USER');
        $repairer = $this->repairerRepository->findOneBy([]);
        $discussion = $this->getDiscussionWithRepairerAndCustomer($repairer, $customer);

        $this->createClientWithUser($repairer->owner)->request('POST', '/discussion_messages', [
            'json' => [
                'discussion' => sprintf('/discussions/%s', $discussion->id),
                'content' => 'Hello',
            ],
        ]);
        self::assertResponseIsSuccessful();
    }

    public function testCustomerCannotAddMessageInOtherDiscussion(): void
    {
        $customer = $this->userRepository->getUserWithRole('ROLE_USER');
        $repairer = $this->repairerRepository->findOneBy([]);
        $discussion = $this->getDiscussionWithRepairerAndCustomer($repairer, $customer);

        $this->createClientAuthAsUser()->request('POST', '/discussion_messages', [
            'json' => [
                'discussion' => sprintf('/discussions/%s', $discussion->id),
                'content' => 'Hello',
            ],
        ]);
        self::assertResponseStatusCodeSame(403);
    }

    public function testRepairerCannotAddMessageInOtherDiscussion(): void
    {
        $customer = $this->userRepository->getUserWithRole('ROLE_USER');
        $repairer = $this->repairerRepository->findOneBy([]);
        $discussion = $this->getDiscussionWithRepairerAndCustomer($repairer, $customer);

        $this->createClientAuthAsRepairer()->request('POST', '/discussion_messages', [
            'json' => [
                'discussion' => sprintf('/discussions/%s', $discussion->id),
                'content' => 'Hello',
            ],
        ]);
        self::assertResponseStatusCodeSame(403);
    }
}
