<?php

declare(strict_types=1);

namespace App\Tests\Customers\Security;

use App\Entity\Appointment;
use App\Entity\Repairer;
use App\Repository\AppointmentRepository;
use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class GetTest extends AbstractTestCase
{
    /** @var Appointment[] */
    protected array $appointments = [];

    protected Repairer $repairer;

    public function setUp(): void
    {
        parent::setUp();

        $this->appointments = static::getContainer()->get(AppointmentRepository::class)->findAll();
        $repairerRepository = static::getContainer()->get(RepairerRepository::class);

        // repairer id with at least 2 customers given
        $this->repairer = $repairerRepository->getRepairerIdWithMultipleCustomerAppointments();
    }

    public function testRepairerCanGetOwnCustomersCollection(): void
    {
        $response = $this->createClientWithUser($this->repairer->owner)->request('GET', '/customers')->toArray();

        $this->assertResponseIsSuccessful();
        $this->assertGreaterThanOrEqual(2, count($response['hydra:member']));
        // check if repairer don't get all the customers collection
        $this->assertLessThan(count($this->appointments), count($response['hydra:member']));
    }

    public function testAdminCanGetCustomersCollection(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', '/customers');
        // 404 expected because this admin don't have repairer so should not have customers
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testRepairerCanGetCustomersByFirstName(): void
    {
        $response = $this->createClientWithUser($this->repairer->owner)->request('GET', '/customers')->toArray();

        $customerFirstName = $response['hydra:member'][0]['firstName'];
        $response2 = $this->createClientWithUser($this->repairer->owner)->request('GET', sprintf('/customers?firstName=%s', $customerFirstName))->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertLessThanOrEqual(count($response['hydra:member']), count($response2['hydra:member']));
    }

    public function testRepairerCanGetCustomersByLastName(): void
    {
        $response = $this->createClientWithUser($this->repairer->owner)->request('GET', '/customers')->toArray();

        $customerLastName = $response['hydra:member'][0]['lastName'];
        $response2 = $this->createClientWithUser($this->repairer->owner)->request('GET', sprintf('/customers?lastName=%s', $customerLastName))->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertLessThanOrEqual(count($response['hydra:member']), count($response2['hydra:member']));
    }
}
