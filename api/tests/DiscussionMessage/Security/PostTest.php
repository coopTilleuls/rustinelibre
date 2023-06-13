<?php

declare(strict_types=1);

namespace App\Tests\DiscussionMessage\Security;

use App\Entity\Discussion;
use App\Entity\Repairer;
use App\Entity\User;
use App\Repository\DiscussionRepository;
use App\Repository\RepairerRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;

class PostTest extends AbstractTestCase
{
    private UserRepository $userRepository;

    private RepairerRepository $repairerRepository;

    private DiscussionRepository $discussionRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->userRepository = self::getContainer()->get(UserRepository::class);
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
        $this->discussionRepository = self::getContainer()->get(DiscussionRepository::class);
    }

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

    private function getDiscussionWithRepairerAndCustomer(Repairer $repairer, User $customer): Discussion
    {
        $discussion = $this->discussionRepository->findOneBy(['customer' => $customer, 'repairer' => $repairer]);

        if (!$discussion) {
            $discussionId = $this->createClientWithUser($repairer->owner)->request('POST', '/discussions', [
                'json' => [
                    'repairer' => sprintf('/repairers/%s', $repairer->id),
                    'customer' => sprintf('/users/%s', $customer->id),
                ],
            ])->toArray()['id'];
            $discussion = $this->discussionRepository->find($discussionId);
        }

        return $discussion;
    }
}
