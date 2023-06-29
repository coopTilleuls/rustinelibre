<?php

declare(strict_types=1);

namespace App\Tests\User;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Component\HttpFoundation\Response;

class SecurityUserTest extends AbstractTestCase
{
    use RefreshDatabaseTrait;
    private array $users = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->users = static::getContainer()->get(UserRepository::class)->findAll();
    }

    public function testPostUser(): void
    {
        $this->createClient()->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'newUser@test.com',
                'plainPassword' => 'Test1passwordOk!',
                'firstName' => 'Leon',
                'lastName' => 'Bruxelles',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@type' => 'User',
            'email' => 'newUser@test.com',
        ]);
    }

    public function testPostUserFail(): void
    {
        $this->createClientAuthAsUser()->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'failUser@test.com',
                'plainPassword' => 'Test1passwordOk!',
            ],
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testPutUserByAdmin(): void
    {
        $this->createClientAuthAsAdmin()->request('PUT', '/users/'.$this->users[12]->id, [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'putUser@test.com',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@id' => '/users/'.$this->users[12]->id,
            '@type' => 'User',
            'email' => 'putUser@test.com',
        ]);
    }

    public function testPutUserByHimself(): void
    {
        $client = $this->createClientWithUser($this->users[9]);
        $client->request('PUT', '/users/'.$this->users[9]->id, [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'putUserHimself@test.com',
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@id' => '/users/'.$this->users[9]->id,
            '@type' => 'User',
            'email' => 'putUserHimself@test.com',
        ]);
    }

    public function testPutUserFail(): void
    {
        $this->createClientAuthAsUser()->request('PUT', '/users/'.$this->users[20]->id, [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'putUser@test.com',
            ],
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testGetUserByAdmin(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', '/users/'.$this->users[21]->id);
        $this->assertResponseIsSuccessful();
    }

    public function testUserGetHimself(): void
    {
        $user = static::getContainer()->get('doctrine')->getRepository(User::class)->findOneBy(['email' => 'user1@test.com']);
        $this->createClientAuthAsUser()->request('GET', '/users/'.$user->id);
        $this->assertResponseIsSuccessful();
    }

    public function testGetUserFail(): void
    {
        // User 15 try to get user 16
        $this->createClientWithUser($this->users[15])->request('GET', '/users/'.$this->users[16]->id);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testGetUserCollection(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', '/users');
        $this->assertResponseIsSuccessful();
    }

    public function testGetUserCollectionFail(): void
    {
        $this->createClientAuthAsUser()->request('GET', '/users');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
