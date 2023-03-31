<?php

namespace App\Tests\User;

use App\Entity\User;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityUserTest extends AbstractTestCase
{
    public function testPostUser(): void
    {
        $this->createClient()->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'newUser@test.com',
                'plainPassword' => 'test',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@id' => '/me',
            '@type' => 'User',
            'email' => 'newUser@test.com',
        ]);
    }

    public function testPostUserFail(): void
    {
        $this->createClientAuthAsUser()->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'roles' => ["ROLE_USER"],
                'email' => "failUser@test.com",
                'plainPassword' => "test",
            ],
        ]);
        $this->assertResponseStatusCodeSame(403);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testPutUser(): void
    {
        $user = static::getContainer()->get('doctrine')->getRepository(User::class)->findOneBy(['email' => 'newUser@test.com']);
        $this->createClientAuthAsAdmin()->request('PUT', '/users/'.$user->getId(), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'putUser@test.com',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testPutUserFail(): void
    {
        $this->createClientAuthAsUser()->request('PUT', '/users/21', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'putUser@test.com',
            ],
        ]);
        $this->assertResponseStatusCodeSame(403);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testGetUserByAdmin(): void
    {
        $user = static::getContainer()->get('doctrine')->getRepository(User::class)->findOneBy(['email' => 'putUser@test.com']);
        $this->createClientAuthAsAdmin()->request('GET', '/users/'.$user->getId());
        $this->assertResponseIsSuccessful();
    }

    public function testGetUser(): void
    {
        $user = static::getContainer()->get('doctrine')->getRepository(User::class)->findOneBy(['email' => 'user1@test.com']);
        $this->createClientAuthAsUser()->request('GET', '/users/'.$user->getId());
        $this->assertResponseIsSuccessful();
    }

    public function testGetModifiedUserFail(): void
    {
        $user = static::getContainer()->get('doctrine')->getRepository(User::class)->findOneBy(['email' => 'putUser@test.com']);
        $this->createClientAuthAsUser()->request('GET', '/users/'.$user->getId());
        $this->assertResponseStatusCodeSame(403);
    }

   public function testGetUserCollection(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', '/users');
        $this->assertResponseIsSuccessful();
    }
    public function testGetUserCollectionFail(): void
    {
        $this->createClientAuthAsUser()->request('GET', '/users');
        $this->assertResponseStatusCodeSame(403);
    }
}
