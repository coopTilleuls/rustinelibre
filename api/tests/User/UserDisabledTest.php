<?php

declare(strict_types=1);

namespace App\Tests\User;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class UserDisabledTest extends AbstractTestCase
{
    private User $users;

    public function setUp(): void
    {
        parent::setUp();

        $this->users = static::getContainer()->get(UserRepository::class)->findOneBy(['emailConfirmed' => false]);
    }

    public function testGetUserNotConfirmedFail(): void
    {
        self::createClientWithUser($this->users)->request('GET', sprintf('/users/%d', $this->users->id));
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testPutUserNotConfirmedFail(): void
    {
        self::createClientWithUser($this->users)->request('PUT', sprintf('/users/%d', $this->users->id), [
        'headers' => ['Content-Type' => 'application/json'],
            'json' => [
        'firstname' => 'test put fail',
                ],
            ]);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testPutUserNotConfirmedCannotConfirmeFail(): void
    {
        self::createClientWithUser($this->users)->request('PUT', sprintf('/users/%d', $this->users->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'emailConfirmed' => true,
            ],
        ]);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testDeleteUserNotConfirmedFail(): void
    {
        self::createClientWithUser($this->users)->request('DELETE', sprintf('/users/%d', $this->users->id));
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
