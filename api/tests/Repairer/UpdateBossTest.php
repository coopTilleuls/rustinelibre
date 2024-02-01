<?php

declare(strict_types=1);

namespace App\Tests\Repairer;

use App\Repository\RepairerEmployeeRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class UpdateBossTest extends AbstractTestCase
{
    private array $repairerEmployees = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->repairerEmployees = static::getContainer()->get(RepairerEmployeeRepository::class)->findAll(); // should be 4 results
    }

    public function testUpdateNoAuth(): void
    {
        $this->createClient()->request('PUT', sprintf('/repairer_change_boss/%s', $this->repairerEmployees[0]->repairer->id));
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public function testUpdateAsUser(): void
    {
        $this->createClientAuthAsUser()->request('PUT', sprintf('/repairer_change_boss/%s', $this->repairerEmployees[0]->repairer->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'newBoss' => sprintf('/users/%d', $this->repairerEmployees[0]->employee->id),
            ],
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testUpdateAsBadBoss(): void
    {
        $this->createClientWithUser($this->repairerEmployees[3]->repairer->owner)->request('PUT', sprintf('/repairer_change_boss/%s', $this->repairerEmployees[0]->repairer->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'newBoss' => sprintf('/users/%d', $this->repairerEmployees[0]->employee->id),
            ],
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testUpdateAsGoodBoss(): void
    {
        $currentBossId = $this->repairerEmployees[0]->repairer->owner->id;
        $currentEmployeeId = $this->repairerEmployees[0]->employee->id;
        $currentFirstRepairerEmployee = $this->repairerEmployees[0];

        $response = $this->createClientWithUser($this->repairerEmployees[0]->repairer->owner)->request('PUT', sprintf('/repairer_change_boss/%s', $this->repairerEmployees[0]->repairer->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'newBoss' => sprintf('/users/%d', $currentEmployeeId),
            ],
        ])->toArray();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        // Check if boss became employee
        $this->assertSame($response['employee']['@id'], sprintf('/users/%d', $currentBossId));
        $this->assertContains('ROLE_EMPLOYEE', $response['employee']['roles']);
        $newRepairerEmployee = static::getContainer()->get(RepairerEmployeeRepository::class)->findOneBy(['id' => $response['id']]);
        // Check if employee became boss
        $this->assertSame($newRepairerEmployee->repairer->owner->id, $currentEmployeeId);
        $this->assertContains('ROLE_BOSS', $newRepairerEmployee->repairer->owner->getRoles());

        // Check if repairerEmployee has been removed
        $repairerEmployeeNotFound = static::getContainer()->get(RepairerEmployeeRepository::class)->findOneBy(['employee' => $currentEmployeeId]);
        $this->assertNull($repairerEmployeeNotFound);
    }

    public function testUpdateAsAdmin(): void
    {
        $currentBossId = $this->repairerEmployees[0]->repairer->owner->id;
        $currentEmployeeId = $this->repairerEmployees[0]->employee->id;
        $response = $this->createClientAuthAsAdmin()->request('PUT', sprintf('/repairer_change_boss/%s', $this->repairerEmployees[0]->repairer->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'newBoss' => sprintf('/users/%d', $currentEmployeeId),
            ],
        ])->toArray();

        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        // Check if boss became employee
        $this->assertSame($response['employee']['@id'], sprintf('/users/%d', $currentBossId));
        $this->assertContains('ROLE_EMPLOYEE', $response['employee']['roles']);
        $newRepairerEmployee = static::getContainer()->get(RepairerEmployeeRepository::class)->findOneBy(['id' => $response['id']]);

        // Check if employee became boss
        $this->assertSame($newRepairerEmployee->repairer->owner->id, $currentEmployeeId);
        $this->assertContains('ROLE_BOSS', $newRepairerEmployee->repairer->owner->getRoles());

        // Check if repairerEmployee has been removed
        $repairerEmployeeNotFound = static::getContainer()->get(RepairerEmployeeRepository::class)->findOneBy(['employee' => $currentEmployeeId]);
        $this->assertNull($repairerEmployeeNotFound);
    }
}
