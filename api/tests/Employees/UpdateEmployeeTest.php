<?php

declare(strict_types=1);

namespace App\Tests\Employees;

use App\Repository\RepairerEmployeeRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class UpdateEmployeeTest extends AbstractTestCase
{
    private array $repairerEmployees = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->repairerEmployees = static::getContainer()->get(RepairerEmployeeRepository::class)->findAll(); // should be 4 results
    }

    public function testUpdateNoAuth(): void
    {
        $this->createClient()->request('PUT', sprintf('/employee_and_user/%s', $this->repairerEmployees[0]->id));
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public function testUpdateAsUser(): void
    {
        $this->createClientAuthAsUser()->request('PUT', sprintf('/employee_and_user/%s', $this->repairerEmployees[0]->id));
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testUpdateAsBadBoss(): void
    {
        $this->createClientWithUser($this->repairerEmployees[3]->repairer->getOwner())->request('PUT', sprintf('/employee_and_user/%s', $this->repairerEmployees[0]->id));
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testUpdateAsGoodBoss(): void
    {
        $response = $this->createClientWithUser($this->repairerEmployees[3]->repairer->getOwner())->request('PUT', sprintf('/employee_and_user/%s', $this->repairerEmployees[3]->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'michel@test.com',
                'firstName' => 'Michel',
                'lastName' => 'Michel Michel',
                'enabled' => true,
            ],
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $responseData = $response->toArray();
        $this->assertEquals('Michel', $responseData['employee']['firstName']);
        $this->assertEquals('Michel Michel', $responseData['employee']['lastName']);
        $this->assertEquals('michel@test.com', $responseData['employee']['email']);
        $this->assertTrue($responseData['enabled']);
    }

    public function testUpdateAsAdmin(): void
    {
        $response = $this->createClientAuthAsAdmin($this->repairerEmployees[3]->repairer->getOwner())->request('PUT', sprintf('/employee_and_user/%s', $this->repairerEmployees[3]->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'firstName' => 'Michel Michel',
                'lastName' => 'Michel',
                'enabled' => false,
            ],
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);

        $responseData = $response->toArray();
        $this->assertEquals('Michel Michel', $responseData['employee']['firstName']);
        $this->assertEquals('Michel', $responseData['employee']['lastName']);
        $this->assertFalse($responseData['enabled']);
    }
}
