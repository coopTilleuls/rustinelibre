<?php

declare(strict_types=1);

namespace App\Tests\Discussion\Validator;

use App\Repository\RepairerRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Contracts\Translation\TranslatorInterface;

class UniqueDiscussionValidatorTest extends AbstractTestCase
{
    private UserRepository $userRepository;

    private RepairerRepository $repairerRepository;

    private TranslatorInterface $translator;

    public function setUp(): void
    {
        parent::setUp();
        $this->userRepository = self::getContainer()->get(UserRepository::class);
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
        $this->translator = static::getContainer()->get(TranslatorInterface::class);
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
            'hydra:description' => sprintf($this->translator->trans('discussion.unique', domain: 'validators')),
        ]);
    }
}
