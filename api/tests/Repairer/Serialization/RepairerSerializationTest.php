<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Serialization;

use App\Entity\Repairer;
use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class RepairerSerializationTest extends AbstractTestCase
{
    /** @var Repairer[] */
    private array $repairers = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->repairers = static::getContainer()->get(RepairerRepository::class)->findAll();
    }

    public function testGetRepairerCollectionByConnectedUser(): void
    {
        // classic user given
        $response = self::createClientAuthAsUser()->request('GET', '/repairers');
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $response = $response['hydra:member'];

        // test collection normalization groups
        foreach ($response as $repairer) {
            $this->assertArrayNotHasKey('description', $repairer);
            $this->assertArrayNotHasKey('mobilePhone', $repairer);
            $this->assertArrayNotHasKey('owner', $repairer);
            $this->assertArrayHasKey('name', $repairer);
            $this->assertArrayHasKey('latitude', $repairer);
            $this->assertArrayHasKey('longitude', $repairer);
        }
    }

    public function testGetRepairerCollectionByDisconnectedUser(): void
    {
        // disconnected user given
        $response = self::createClient()->request('GET', '/repairers')->toArray();
        $this->assertResponseIsSuccessful();
        $response = $response['hydra:member'];

        // test collection normalization groups
        foreach ($response as $repairer) {
            $this->assertArrayNotHasKey('description', $repairer);
            $this->assertArrayNotHasKey('mobilePhone', $repairer);
            $this->assertArrayNotHasKey('owner', $repairer);
            $this->assertArrayHasKey('name', $repairer);
            $this->assertArrayHasKey('latitude', $repairer);
            $this->assertArrayHasKey('longitude', $repairer);
        }
    }

    public function testGetRepairerByConnectedUser(): void
    {
        // classic user given and get random repairer
        $response = self::createClientAuthAsUser()->request('GET', sprintf('/repairers/%d', $this->repairers[4]->id))->toArray();
        $this->assertResponseIsSuccessful();

        $this->assertArrayHasKey('description', $response);
        $this->assertArrayHasKey('mobilePhone', $response);
        $this->assertArrayHasKey('owner', $response);
        $this->assertArrayHasKey('repairerType', $response);
        $this->assertArrayHasKey('name', $response);
        $this->assertArrayHasKey('latitude', $response);
        $this->assertArrayHasKey('longitude', $response);
    }

    public function testGetRepairerByDisconnectedUser(): void
    {
        // disconnected user given classic user given and get random repairer
        $response = self::createClient()->request('GET', sprintf('/repairers/%d', $this->repairers[4]->id));
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();

        $this->assertArrayHasKey('description', $response);
        $this->assertArrayHasKey('mobilePhone', $response);
        $this->assertArrayHasKey('owner', $response);
        $this->assertArrayHasKey('repairerType', $response);
        $this->assertArrayHasKey('name', $response);
        $this->assertArrayHasKey('latitude', $response);
        $this->assertArrayHasKey('longitude', $response);
    }

    public function testGetUnknownRepairer(): void
    {
        // classic user given
        self::createClientAuthAsUser()->request('GET', sprintf('/repairers/999999'));
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }
}
