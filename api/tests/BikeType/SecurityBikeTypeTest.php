<?php

namespace App\Tests\BikeType;

use App\Entity\BikeType;
use App\Repository\BikeTypeRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityBikeTypeTest extends AbstractTestCase
{
    public function testGetBikeType(): void
    {
        $bikeType1 = $this->getObjectByClassNameAndValues(BikeTypeRepository::class, ['name' => 'Vélo classique']);
        $this->createClientAuthAsUser()->request('GET', '/bike_types/'.$bikeType1->getId());
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
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
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
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }
}
