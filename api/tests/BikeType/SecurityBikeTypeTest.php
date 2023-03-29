<?php

namespace App\Tests\BikeType;

use App\Entity\BikeType;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityBikeTypeTest extends AbstractTestCase
{
    public function testPostBikeType(): void
    {
        self::createClientAuthAsAdmin()->request('POST', '/bike_types', [
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
        self::createClientAuthAsUser()->request('POST', '/bike_types', [
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

        self::createClientAuthAsAdmin()->request('PUT', '/bike_types/'.$bikeCargo->getId(), [
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

        self::createClientAuthAsUser()->request('PUT', '/bike_types/'.$bikeCargo->getId(), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Vélo hollandais',
            ],
        ]);
        $this->assertResponseStatusCodeSame(403);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testGetBikeType(): void
    {
        $bikeCargo = static::getContainer()->get('doctrine')->getRepository(BikeType::class)->findOneBy(['name' => 'Vélo hollandais']);

        $client = self::createClientAuthAsUser();
        // classic user given
        $response = $client->request('GET', '/bike_types/'.$bikeCargo->getId());
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertSame($response['name'], 'Vélo hollandais');
    }
}
