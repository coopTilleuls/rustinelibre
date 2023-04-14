<?php

declare(strict_types=1);

namespace App\Tests\Employees;

use App\Entity\User;
use App\Repository\RepairerEmployeeRepository;
use App\Repository\RepairerRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class CreateEmployeeTest extends AbstractTestCase
{
    private array $jsonNewEmployee = [];
    private array $repairers = [];
    private array $repairerEmployees = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->repairers = static::getContainer()->get(RepairerRepository::class)->findAll();
        $this->repairerEmployees = static::getContainer()->get(RepairerEmployeeRepository::class)->findAll(); // should be 4 results

        $this->jsonNewEmployee = [
            'email' => 'new_user@mail.com',
            'plainPassword' => 'Test1passwordOk!',
            'firstName' => 'Michel',
            'lastName' => 'Michel',
            'repairer' => '/repairers/'.$this->repairers[0]->getId(),
        ];
    }

    public function testCreateEmployeeNoAuth(): void
    {
        $jsonRequest = $this->jsonNewEmployee;

        $this->createClient()->request('POST', '/repairer_employees', ['json' => $jsonRequest]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public function testCreateEmployeeAsUser(): void
    {
        $jsonRequest = $this->jsonNewEmployee;

        $this->createClientAuthAsUser()->request('POST', '/repairer_employees', ['json' => $jsonRequest]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testCreateEmployeeAsAdmin(): void
    {
        $jsonRequest = $this->jsonNewEmployee;
        $secondRepairerIri = '/repairers/'.$this->repairers[1]->getId();
        $jsonRequest['repairer'] = $secondRepairerIri;

        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_employees', ['json' => $jsonRequest]);
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $responseData = $response->toArray();
        $this->assertEquals('RepairerEmployee', $responseData['@type']);
        $this->assertEquals($secondRepairerIri, $responseData['repairer']);
        $this->assertArrayHasKey('employee', $responseData);
        $this->assertArrayHasKey('email', $responseData['employee']);
        $this->assertArrayHasKey('lastName', $responseData['employee']);
        $this->assertArrayHasKey('firstName', $responseData['employee']);
    }

    public function testCreateEmployeeAsBoss(): void
    {
        $jsonRequest = $this->jsonNewEmployee;
        $jsonRequest['email'] = 'second_user@mail.com';

        // Does not provide a repairer, should inject it automatically
        unset($jsonRequest['repairer']);

        /** @var User $currentBoss */
        $currentBoss = $this->getObjectByClassNameAndValues(UserRepository::class, ['email' => 'boss@test.com']);
        $currentRepairer = $currentBoss->repairer;

        $response = $this->createClientAuthAsBoss()->request('POST', '/repairer_employees', ['json' => $jsonRequest]);
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $responseData = $response->toArray();
        $this->assertEquals('RepairerEmployee', $responseData['@type']);
        $this->assertEquals('/repairers/'.$currentRepairer->getId(), $responseData['repairer']);
        $this->assertArrayHasKey('employee', $responseData);
        $this->assertArrayHasKey('email', $responseData['employee']);
        $this->assertArrayHasKey('lastName', $responseData['employee']);
        $this->assertArrayHasKey('firstName', $responseData['employee']);
    }

    public function testRemoveEmployeeNotAuth(): void
    {
        $this->createClient()->request('DELETE', '/repairer_employees/'.$this->repairerEmployees[0]->getId());
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public function testRemoveEmployeeAsUser(): void
    {
        $this->createClientAuthAsUser()->request('DELETE', '/repairer_employees/'.$this->repairerEmployees[0]->getId());
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testRemoveEmployeeAsBadBoss(): void
    {
        $repairerEmployee5 = static::getContainer()->get(RepairerEmployeeRepository::class)->findAll()[4];
        $this->createClientAuthAsBoss()->request('DELETE', '/repairer_employees/'.$repairerEmployee5->getId());
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testRemoveEmployeeAsBoss(): void
    {
        $repairerEmployee6 = static::getContainer()->get(RepairerEmployeeRepository::class)->findAll()[5];
        $this->createClientAuthAsBoss()->request('DELETE', '/repairer_employees/'.$repairerEmployee6->getId());
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testRemoveEmployeeAsAdmin(): void
    {
        $repairerEmployee5 = static::getContainer()->get(RepairerEmployeeRepository::class)->findAll()[4];
        $this->createClientAuthAsAdmin()->request('DELETE', '/repairer_employees/'.$repairerEmployee5->getId());
        $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }
}
