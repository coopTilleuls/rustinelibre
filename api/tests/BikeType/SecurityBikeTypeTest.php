<?php

namespace App\Tests\BikeType;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityBikeTypeTest extends AbstractTestCase
{
    public function testPostBikeType(): void
    {
        $client = self::createClientAuthAsAdmin();

        // Valid admin given
        $response = $client->request('POST', '/bike_types', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Vélo cargo',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(201);
    }

    public function testPostBikeTypeFail(): void
    {
        $client = self::createClientAuthAsUser();

        // classic user given
        $response = $client->request('POST', '/bike_types', [
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
        $client = self::createClientAuthAsAdmin();

        // Valid admin given
        $response = $client->request('PUT', '/bike_types/3', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Vélo hollandais',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
    }

    public function testPutBikeTypeFail(): void
    {
        $client = self::createClientAuthAsUser();

        // classic user given
        $response = $client->request('PUT', '/bike_types/3', [
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
        $client = self::createClientAuthAsUser();
        // classic user given
        $response = $client->request('GET', '/bike_types/3');
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertSame($response['name'], 'Vélo hollandais');
    }
}
