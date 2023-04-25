<?php

declare(strict_types=1);

namespace App\Tests\User;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class UserDisabledTest extends AbstractTestCase
{
    private User $user;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = static::getContainer()->get(UserRepository::class)->findOneBy(['emailConfirmed' => false]);
    }

    public function testGetUserNotConfirmedFail(): void
    {
        self::createClientWithUser($this->user)->request('GET', sprintf('/users/%d', $this->user->id));
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testGetUserNotConfirmedOnCustomUrlFail(): void
    {
        self::createClientWithUser($this->user)->request('GET', '/me');
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testPutUserNotConfirmedFail(): void
    {
        self::createClientWithUser($this->user)->request('PUT', sprintf('/users/%d', $this->user->id), [
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
        self::createClientWithUser($this->user)->request('PUT', sprintf('/users/%d', $this->user->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'emailConfirmed' => true,
            ],
        ]);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testDeleteUserNotConfirmedWork(): void
    {
        self::createClientWithUser($this->user)->request('DELETE', sprintf('/users/%d', $this->user->id));
        $this->assertResponseIsSuccessful();
    }
}
