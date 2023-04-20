<?php

declare(strict_types=1);

namespace App\Tests\Employees;

use App\Entity\User;
use App\Repository\RepairerEmployeeRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

class RetrieveEmployeesTest extends AbstractTestCase
{
    private array $repairerEmployees = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->repairerEmployees = static::getContainer()->get(RepairerEmployeeRepository::class)->findAll(); // should be 4 results
    }

    public function testGetRepairerEmployeesAsUser(): void
    {
        $this->createClientAuthAsUser()->request('GET', '/repairer_employees');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testGetRepairerEmployeeAsUser(): void
    {
        $this->createClientAuthAsUser()->request('GET', '/repairer_employees/'.$this->repairerEmployees[0]->id);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testGetRepairerEmployeesAsAdmin(): void
    {
        $response = $this->createClientAuthAsAdmin()->request('GET', '/repairer_employees');
        $this->assertResponseIsSuccessful();
        // Minimum 4 employees (as in fixtures), maybe more if other test create it
        $this->assertTrue(4 <= $response->toArray()['hydra:totalItems']);
    }

    public function testGetRepairerEmployeeAsAdmin(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', '/repairer_employees/'.$this->repairerEmployees[0]->id);
        $this->assertResponseIsSuccessful();
    }

    public function testGetRepairerEmployeeAsBadBoss(): void
    {
        // Boss of repairer 1 try to get an employee of repairer 2
        $this->createClientAuthAsBoss()->request('GET', '/repairer_employees/'.$this->repairerEmployees[2]->id);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testGetRepairerEmployeeAsGoodBoss(): void
    {
        // Boss of repairer 1 try to get an employee of repairer 1
        $this->createClientAuthAsBoss()->request('GET', '/repairer_employees/'.$this->repairerEmployees[0]->id);
        $this->assertResponseIsSuccessful();
    }

    public function testGetEmployeesAsBossWithEmployees(): void
    {
        // Boss of repairer 1 try to get an employee of repairer 2
        $response = $this->createClientAuthAsBoss()->request('GET', '/repairer_employees');
        $this->assertEquals(2, $response->toArray()['hydra:totalItems']);
    }

    public function testGetEmployeesAsBossWithNoEmployees(): void
    {
        $users = array_reverse(static::getContainer()->get(UserRepository::class)->findAll());

        $firstRandomBoss = null;
        /** @var User $user */
        foreach ($users as $user) {
            if ($user->isBoss() && 'boss@test.com' !== $user->email) {
                $firstRandomBoss = $user;
            }
        }

        if (!$firstRandomBoss) {
            throw new NotFoundHttpException('No boss found');
        }

        // Boss of repairer 1 try to get an employee of repairer 2
        $response = $this->createClientWithCredentials(['email' => $firstRandomBoss->email, 'password' => 'Test1passwordOk!'])->request('GET', '/repairer_employees');
        $this->assertEquals(0, $response->toArray()['hydra:totalItems']);
    }
}
