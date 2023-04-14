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
        $this->createClientAuthAsAdmin()->request('PUT', '/users/13', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'putUser@test.com',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@id' => '/users/13',
            '@type' => 'User',
            'email' => 'putUser@test.com',
        ]);
    }

    public function testPutUserByHimself(): void
    {
        $client = $this->createClientWithUserId();
        $client->request('PUT', '/users/10', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'putUserHimself@test.com',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@id' => '/users/10',
            '@type' => 'User',
            'email' => 'putUserHimself@test.com',
        ]);
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
        $this->createClientAuthAsAdmin()->request('GET', '/users/21');
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
        $this->createClientAuthAsUser()->request('GET', '/users/17');
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
