<?php

declare(strict_types=1);

namespace App\Tests\Discussion\Validator;

use App\Repository\RepairerRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;

class DiscussionValidatorTest extends AbstractTestCase
{
    private UserRepository $userRepository;

    private RepairerRepository $repairerRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->userRepository = self::getContainer()->get(UserRepository::class);
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
    }

    public function testCannotCreateTwoDiscussionForSameRepairerAndCustomer(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $customer = $this->userRepository->getUserWithRole('ROLE_USER');
        $client = $this->createClientWithUser($repairer->owner);

        $client->request('POST', '/discussions', [
            'json' => [
                'repairer' => sprintf('/repairers/%s', $repairer->id),
                'customer' => sprintf('/users/%s', $customer->id),
            ],
        ]);
        self::assertResponseIsSuccessful();

        $client->request('POST', '/discussions', [
            'json' => [
                'repairer' => sprintf('/repairers/%s', $repairer->id),
                'customer' => sprintf('/users/%s', $customer->id),
            ],
        ]);
        self::assertResponseStatusCodeSame(422);
        self::assertJsonContains([
            'hydra:description' => 'Cannot create two discussions for the same repairer and customer',
        ]);
    }
}
