<?php

declare(strict_types=1);

namespace App\Tests\DiscussionMessage;

use App\Entity\Discussion;
use App\Entity\Repairer;
use App\Entity\User;
use App\Repository\DiscussionRepository;
use App\Repository\RepairerRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;

class DiscussionMessageAbstractTestCase extends AbstractTestCase
{
    protected UserRepository $userRepository;

    protected RepairerRepository $repairerRepository;

    protected DiscussionRepository $discussionRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->userRepository = self::getContainer()->get(UserRepository::class);
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
        $this->discussionRepository = self::getContainer()->get(DiscussionRepository::class);
    }

    public function getDiscussionWithRepairerAndCustomer(Repairer $repairer, User $customer): Discussion
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
