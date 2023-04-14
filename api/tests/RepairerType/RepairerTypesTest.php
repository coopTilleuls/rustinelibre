<?php

declare(strict_types=1);

namespace App\Tests\RepairerType;

use App\Repository\RepairerTypeRepository;
use App\Tests\AbstractTestCase;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Component\HttpFoundation\Response;

class RepairerTypesTest extends AbstractTestCase
{
    use RefreshDatabaseTrait;

    private array $repairerTypes = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->repairerTypes = static::getContainer()->get(RepairerTypeRepository::class)->findAll();
    }

    public function testGetCollection(): void
    {
        $response = static::createClient()->request('GET', '/repairer_types');
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $responseData = $response->toArray();
        $this->assertEquals(3, $responseData['hydra:totalItems']);
        $this->assertArrayHasKey('id', $responseData['hydra:member'][0]);
        $this->assertArrayHasKey('name', $responseData['hydra:member'][0]);
    }

    public function testGet(): void
    {
        $response = static::createClient()->request('GET', '/repairer_types/'.$this->repairerTypes[0]->getId());
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $responseData = $response->toArray();
        $this->assertArrayHasKey('id', $responseData);
        $this->assertArrayHasKey('name', $responseData);
    }

    public function testPostNotAllowed(): void
    {
        $this->createClientAuthAsUser()->request('POST', '/repairer_types', ['json' => [
            'name' => 'Nouvelle solution de réparation',
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testPost(): void
    {
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_types', ['json' => [
            'name' => 'Nouvelle solution de réparation',
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $responseData = $response->toArray();
        $this->assertEquals('Nouvelle solution de réparation', $responseData['name']);
    }

    public function testPutNotAllowed(): void
    {
        $this->createClientAuthAsUser()->request('PUT', '/repairer_types/'.$this->repairerTypes[2]->getId(), ['json' => [
            'name' => 'Nom mis à jour',
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testPut(): void
    {
        $response = $this->createClientAuthAsAdmin()->request('PUT', '/repairer_types/'.$this->repairerTypes[2]->getId(), ['json' => [
            'name' => 'Nom mis à jour',
        ]]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $responseData = $response->toArray();
        $this->assertEquals('Nom mis à jour', $responseData['name']);
    }
}
