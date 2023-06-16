<?php

declare(strict_types=1);

namespace App\Tests\User;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Component\HttpFoundation\Response;

class MailConfirmationTest extends AbstractTestCase
{
    use RefreshDatabaseTrait;

    public function testInvalidCode(): void
    {
        $this->createClientAuthAsUser()->request('POST', '/validation-code', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'code' => 9999,
            ],
        ]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_FORBIDDEN);
    }

    public function testValidCode(): void
    {
        /** @var User $userTest */
        $userTest = self::getContainer()->get(UserRepository::class)->findOneBy(['email' => 'user1@test.com']);

        $this->createClientAuthAsUser()->request('POST', '/validation-code', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'code' => $userTest->validationCode,
            ],
        ]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_CREATED);
    }
}
