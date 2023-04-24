<?php

namespace App\Tests\Repairer;

use App\Entity\Repairer;
use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityDisabledRepairerTest extends AbstractTestCase
{
    /** @var Repairer[] */
    private array $repairers = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->repairers = static::getContainer()->get(RepairerRepository::class)->findAll();
    }

    public function testDeleteByRepairerDisabledFail(): void
    {
        // Get a disabled repairer
        $falseRepairer = static::getContainer()->get(RepairerRepository::class)->findBy(['enabled' => false]);
        $repairer = $falseRepairer[0];

        // Create request with his owner
        $client = self::createClientWithUser($repairer->owner);
        $client->request('PUT', '/repairers/'.$repairer->id, [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'test delete',
                'description' => 'test delete disabled failed',
            ],
        ]);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testPutByRepairerDisabledFail(): void
    {
        // Get a disabled repairer
        $falseRepairer = static::getContainer()->get(RepairerRepository::class)->findBy(['enabled' => false]);
        $repairer = $falseRepairer[0];

        // Create request with his owner
        $client = self::createClientWithUser($repairer->owner);
        $client->request('PUT', '/repairers/'.$repairer->id, [
             'headers' => ['Content-Type' => 'application/json'],
             'json' => [
                 'name' => 'New Name',
                 'description' => 'test put disabled failed',
             ],
         ]);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testPatchByRepairerDisabledFail(): void
    {
        // Get a disabled repairer
        $falseRepairer = static::getContainer()->get(RepairerRepository::class)->findBy(['enabled' => false]);
        $repairer = $falseRepairer[0];

        // Create request with his owner
        $client = self::createClientWithUser($repairer->owner);
        $client->request('PATCH', '/repairers/'.$repairer->id, [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'patched Name',
                'description' => 'test patch disabled failed',
            ],
        ]);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
