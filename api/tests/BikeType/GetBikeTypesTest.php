<?php

namespace App\Tests\BikeType;

use App\Entity\BikeType;
use App\Repository\BikeTypeRepository;
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
        $this->assertIsInt($response['hydra:member'][0]['id']);
        $this->assertSame('Vélo classique', $response['hydra:member'][0]['name']);
    }

    public function testGetClassicBikeTypeItem(): void
    {
        $bikeTypeName = 'Vélo classique';
        $bikeType1 = $this->getObjectByClassNameAndValues(BikeTypeRepository::class, ['name' => $bikeTypeName]);

        $response = static::createClient()->request('GET', '/bike_types/'.$bikeType1->getId());
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertArrayHasKey('id', $response);
        $this->assertArrayHasKey('name', $response);
        $this->assertSame($response['name'], $bikeTypeName);
    }

    public function testGetElectricBikeTypeItem(): void
    {
        $bikeTypeName = 'Vélo électrique';

        $bikeType2 = $this->getObjectByClassNameAndValues(BikeTypeRepository::class, ['name' => $bikeTypeName]);
        $response = static::createClient()->request('GET', '/bike_types/'.$bikeType2->getId());
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertArrayHasKey('id', $response);
        $this->assertArrayHasKey('name', $response);
        $this->assertSame($response['name'], $bikeTypeName);
    }
}
