<?php

declare(strict_types=1);

namespace App\Tests;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Entity\User;
use App\Repository\UserRepository;

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
                'password' => 'test',
            ],
        ]);

        $json = $response->toArray();

        $client = static::createClient([], ['headers' => ['authorization' => 'Bearer '.$json['token']]]);

        return $client;
    }

    protected function createClientWithCredentials(array $body = []): Client
    {
        $response = static::createClient()->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => $body ?: [
                'email' => 'user1@test.com',
                'password' => 'test',
            ],
        ]);

        $json = $response->toArray();

        $client = static::createClient([], ['headers' => ['authorization' => 'Bearer '.$json['token']]]);

        return $client;
    }

    protected function createClientAuthAsUser(): Client
    {
        return $this->createClientWithCredentials();
    }

    protected function createClientAuthAsRepairer(): Client
    {
        return $this->createClientWithCredentials(['email' => 'repairer2@test.com', 'password' => 'test']);
    }

    protected function createClientAuthAsBoss(): Client
    {
        return $this->createClientWithCredentials(['email' => 'boss@test.com', 'password' => 'test']);
    }

    protected function authById(): Client
    {
        $client = static::createClient();
        $userRepository = static::getContainer()->get(UserRepository::class);
        $testUser = $userRepository->findOneBy(['id' => 10]);
        $client->loginUser($testUser);

        return $client;
    }
}
