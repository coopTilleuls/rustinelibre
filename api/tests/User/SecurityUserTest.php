<?php

namespace App\Tests\User;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityUserTest extends AbstractTestCase
{
    public function testPostUser(): void
    {
        $this->createClientAuthAsAdmin()->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Vélo cargo',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
    }

    public function testGetUser(): void
    {
        $this->createClientAuthAsUser()->request('GET', '/bike_types/1');
        $this->assertResponseIsSuccessful();
    }

    public function testPostUserFail(): void
    {
        $this->createClientAuthAsUser()->request('POST', '/bike_types', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Vélo cargo',
            ],
        ]);
        $this->assertResponseStatusCodeSame(403);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testPutUser(): void
    {
        $bikeCargo = static::getContainer()->get('doctrine')->getRepository(BikeType::class)->findOneBy(['name' => 'Vélo cargo']);

        $this->createClientAuthAsAdmin()->request('PUT', '/bike_types/'.$bikeCargo->getId(), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Vélo hollandais',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testPutUserFail(): void
    {
        $bikeCargo = static::getContainer()->get('doctrine')->getRepository(BikeType::class)->findOneBy(['name' => 'Vélo hollandais']);

        $this->createClientAuthAsUser()->request('PUT', '/bike_types/'.$bikeCargo->getId(), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Vélo hollandais',
            ],
        ]);
        $this->assertResponseStatusCodeSame(403);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testGetModifiedUser(): void
    {
        $this->createClientAuthAsUser()->request('GET', '/bike_types/1');
        $this->assertResponseIsSuccessful();
    }

}