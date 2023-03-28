<?php

namespace App\Tests\BikeType;

use App\Entity\BikeType;
use App\Tests\AbstractTestCase;

class GetBikeTypesTest extends AbstractTestCase
{
    public function testGetBikeTypeCollection(): void
    {
        $response = static::createClient()->request('GET', '/bike_types');
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $response = $response->toArray();
        $this->assertMatchesResourceCollectionJsonSchema(BikeType::class);
        $this->assertIsArray($response['hydra:member']);
        $this->assertArrayHasKey('id', $response['hydra:member'][0]);
        $this->assertArrayHasKey('name', $response['hydra:member'][0]);

    }
    public function testGetClassicBikeTypeItem(): void
    {
        $response = static::createClient()->request('GET', '/bike_types/1');
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertArrayHasKey('id', $response);
        $this->assertArrayHasKey('name', $response);
        $this->assertSame($response['name'], 'Vélo classique');
    }
    public function testGetElectricBikeTypeItem(): void
    {
        $response = static::createClient()->request('GET', '/bike_types/2');
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertArrayHasKey('id', $response);
        $this->assertArrayHasKey('name', $response);
        $this->assertSame($response['name'], 'Vélo électrique');
    }
}
