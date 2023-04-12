<?php

declare(strict_types=1);

namespace App\Tests\Employees;

use App\Tests\AbstractTestCase;

class RetrieveEmployeesTest extends AbstractTestCase
{
    public function testGetRepairerEmployeesAsUser(): void
    {
        $this->createClientAuthAsUser()->request('GET', '/repairer_employees');
        $this->assertResponseStatusCodeSame(403);
    }

    public function testGetRepairerEmployeeAsUser(): void
    {
        $this->createClientAuthAsUser()->request('GET', '/repairer_employees/1');
        $this->assertResponseStatusCodeSame(403);
    }

    public function testGetRepairerEmployeesAsAdmin(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', '/repairer_employees');
        $this->assertResponseIsSuccessful();
    }

    public function testGetRepairerEmployeeAsAdmin(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', '/repairer_employees/1');
        $this->assertResponseIsSuccessful();
    }

    public function testGetRepairerEmployeeAsBadBoss(): void
    {
        // Boss of repairer 1 try to get an employee of repairer 2
        $this->createClientAuthAsBoss()->request('GET', '/repairer_employees/3');
        $this->assertResponseStatusCodeSame(403);
    }

    public function testGetRepairerEmployeeAsGoodBoss(): void
    {
        // Boss of repairer 1 try to get an employee of repairer 1
        $this->createClientAuthAsBoss()->request('GET', '/repairer_employees/1');
        $this->assertResponseIsSuccessful();
    }

    public function testGetRepairerEmployeesAsBoss(): void
    {
        // Boss of repairer 1 try to get an employee of repairer 2
        $this->createClientAuthAsBoss()->request('GET', '/repairer_employees/3');
        $this->assertResponseStatusCodeSame(403);
    }

    public function testGetRepairerEmployeesAsGoodBoss(): void
    {
        // Boss of repairer 1 try to get an employee of repairer 1
        $this->createClientWithCredentials(['email' => 'boss@test.com', 'password' => 'test'])->request('GET', '/repairer_employees/1');
        $this->assertResponseIsSuccessful();
    }

    public function testGetRepairersAsAdmin(): void
    {
        // Boss of repairer 1 try to get an employee of repairer 2
        $response = $this->createClientAuthAsAdmin()->request('GET', '/repairer_employees');
        // Minimum 4 employees (as in fixtures), maybe more if other test create it
        $this->assertTrue(4 <= $response->toArray()['hydra:totalItems']);
    }

    public function testGetRepairersAsBossWithEmployees(): void
    {
        // Boss of repairer 1 try to get an employee of repairer 2
        $response = $this->createClientAuthAsBoss()->request('GET', '/repairer_employees');
        $this->assertEquals(2, $response->toArray()['hydra:totalItems']);
    }

    public function testGetRepairersAsBossWithNoEmployees(): void
    {
        // Boss of repairer 1 try to get an employee of repairer 2
        $response = $this->createClientWithUserId(28)->request('GET', '/repairer_employees');
        $this->assertEquals(0, $response->toArray()['hydra:totalItems']);
    }
}
