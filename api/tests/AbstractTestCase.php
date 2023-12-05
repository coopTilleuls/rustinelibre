<?php

declare(strict_types=1);

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Entity\User;

abstract class AbstractTestCase extends ApiTestCase
{
    protected function setUp(): void
    {
        self::bootKernel();
    }

    protected function createClientAuthAsAdmin(): Client
    {
        $response = static::createClient()->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'clement@les-tilleuls.coop',
                'password' => 'Test1passwordOk!',
            ],
        ]);

        $json = $response->toArray();

        $client = static::createClient([], ['headers' => ['appli-authorization' => 'Bearer '.$json['token']]]);

        return $client;
    }

    protected function createClientWithCredentials(array $body = []): Client
    {
        $response = static::createClient()->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => $body ?: [
                'email' => 'user1@test.com',
                'password' => 'Test1passwordOk!',
            ],
        ]);

        $json = $response->toArray();

        $client = static::createClient([], ['headers' => ['appli-authorization' => 'Bearer '.$json['token']]]);

        return $client;
    }

    protected function createClientAuthAsUser(): Client
    {
        return $this->createClientWithCredentials();
    }

    protected function createClientAuthAsRepairer(): Client
    {
        return $this->createClientWithCredentials(['email' => 'repairer2@test.com', 'password' => 'Test1passwordOk!']);
    }

    protected function createClientAuthAsBoss(): Client
    {
        return $this->createClientWithCredentials(['email' => 'boss@test.com', 'password' => 'Test1passwordOk!']);
    }

    protected function createClientWithUser(User $user): Client
    {
        $response = static::createClient()->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => $user->email,
                'password' => 'Test1passwordOk!',
            ],
        ]);

        $json = $response->toArray();

        $client = static::createClient([], ['headers' => ['authorization' => 'Bearer '.$json['token']]]);

        return $client;
    }

    protected function getObjectByClassNameAndValues(string $repositoryClassName, array $data)
    {
        return static::getContainer()->get($repositoryClassName)->findOneBy($data);
    }
}
