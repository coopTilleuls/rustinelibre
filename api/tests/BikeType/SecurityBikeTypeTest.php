<?php

namespace App\Tests\BikeType;

use App\Entity\BikeType;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityBikeTypeTest extends AbstractTestCase
{
    public function testGetBikeType(): void
    {
        $this->createClientAuthAsUser()->request('GET', '/bike_types/1');
        $this->assertResponseIsSuccessful();
    }

    public function testPostBikeType(): void
    {
        $this->createClientAuthAsAdmin()->request('POST', '/bike_types', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Vélo cargo',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
    }

    public function testPostBikeTypeFail(): void
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

    public function testPutBikeType(): void
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

    public function testPutBikeTypeFail(): void
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
}
