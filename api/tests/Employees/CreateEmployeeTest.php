<?php

declare(strict_types=1);

namespace App\Tests\Employees;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class CreateEmployeeTest extends AbstractTestCase
{
    public $jsonNewEmployee = [
        "plainPassword"=> "test",
        "firstName"=> "Michel",
        "lastName"=> "Michel",
    ];

    public function testCreateEmployee(): void
    {
        $jsonRequest = $this->jsonNewEmployee;
        $jsonRequest['email'] = "new_user@mail.com";
        $jsonRequest['repairer'] = "/repairers/1";

        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_employees', ['json' => $jsonRequest]);
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $responseData = $response->toArray();
        $this->assertEquals('RepairerEmployee', $responseData['@type']);
        $this->assertEquals('/repairers/1', $responseData['repairer']);
        $this->assertArrayHasKey('employee', $responseData);
        $this->assertArrayHasKey('email', $responseData['employee']);
        $this->assertArrayHasKey('lastName', $responseData['employee']);
        $this->assertArrayHasKey('firstName', $responseData['employee']);
    }

    public function testCreateEmployeeAsBoss(): void
    {
        $jsonRequest = $this->jsonNewEmployee;
        $jsonRequest['email'] = "second_user@mail.com";

        $response = $this->createClientAuthAsBoss()->request('POST', '/repairer_employees', ['json' => $jsonRequest]);
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $responseData = $response->toArray();
        $this->assertEquals('RepairerEmployee', $responseData['@type']);
        $this->assertEquals('/repairers/1', $responseData['repairer']);
        $this->assertArrayHasKey('employee', $responseData);
        $this->assertArrayHasKey('email', $responseData['employee']);
        $this->assertArrayHasKey('lastName', $responseData['employee']);
        $this->assertArrayHasKey('firstName', $responseData['employee']);
    }

    // public function testRemoveEmployeeNotAuth(): void
    // {
    //     $this->createClient()->request('DELETE', '/repairer_employees/5');
    //     $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    // }
    //
    // public function testRemoveEmployeeAsUser(): void
    // {
    //     $this->createClientAuthAsUser()->request('DELETE', '/repairer_employees/5');
    //     $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    // }
    //
    // public function testRemoveEmployeeAsBadBoss(): void
    // {
    //     $this->createClientAuthAsUser()->request('DELETE', '/repairer_employees/28');
    //     $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    // }
    //
    // public function testRemoveEmployeeAsBoss(): void
    // {
    //     $this->createClientAuthAsBoss()->request('DELETE', '/repairer_employees/5');
    //     $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    // }
    //
    // public function testRemoveEmployeeAsAdmin(): void
    // {
    //     $this->createClientAuthAsAdmin()->request('DELETE', '/repairer_employees/6');
    //     $this->assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    // }
}
