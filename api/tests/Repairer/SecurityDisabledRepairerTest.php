<?php

declare(strict_types=1);

namespace App\Tests\Repairer;

use App\Entity\Repairer;
use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityDisabledRepairerTest extends AbstractTestCase
{
    private Repairer $disabledRepairer;

    public function setUp(): void
    {
        parent::setUp();

        $this->disabledRepairer = static::getContainer()->get(RepairerRepository::class)->findOneBy(['enabled' => false]);
    }

    public function testDeleteByRepairerDisabledFail(): void
    {
        self::createClientWithUser($this->disabledRepairer->owner)->request('DELETE', sprintf('/repairers/%s', $this->disabledRepairer->id));
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testRepairerDisabledCannotEnabledFail(): void
    {
        self::createClientWithUser($this->disabledRepairer->owner)->request('PUT', sprintf('/repairers/%s', $this->disabledRepairer->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'enabled' => true,
            ],
        ]);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testPutByRepairerDisabledFail(): void
    {
        self::createClientWithUser($this->disabledRepairer->owner)->request('PUT', sprintf('/repairers/%s', $this->disabledRepairer->id), [
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
        self::createClientWithUser($this->disabledRepairer->owner)->request('PATCH', sprintf('/repairers/%s', $this->disabledRepairer->id), [
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
