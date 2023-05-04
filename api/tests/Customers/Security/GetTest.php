<?php

declare(strict_types=1);

namespace App\Tests\Customers\Security;

use App\Entity\Appointment;
use App\Entity\Repairer;
use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class GetTest extends AbstractTestCase
{
    // Repairer can get all his customers/ find customer by name / cannot get other customers/ admin can get all customers
    /** @var Appointment[] */
    protected array $appointments = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->appointments = static::getContainer()->get(AppointmentRepository::class)->findAll();
    }

    public function testRepairerCanGetOwnCustomersCollection(): void
    {
        // appointment with at least 2 customers expected according to fixtures
        $appointment = static::getContainer()->get(AppointmentRepository::class)->findOneBy(['repairer' => 13]);
        $response = $this->createClientWithUser($appointment->repairer->owner)->request('GET', '/customers')->toArray();

        $this->assertResponseIsSuccessful();
        $this->assertGreaterThanOrEqual(2, count($response['hydra:member']));
    }

    public function testAdminCanGetCustomersCollection(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', '/customers');
        // 404 expected because this admin don't have repairer so should not have customers
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testRepairerCanGetCustomersByFirstName(): void
    {
        // appointment with at least 2 customers for a repairer expected according to fixtures
        $appointment = static::getContainer()->get(AppointmentRepository::class)->findOneBy(['repairer' => 13]);
        $response = $this->createClientWithUser($appointment->repairer->owner)->request('GET', '/customers')->toArray();

        $customerFirstName = $response['hydra:member'][0]['firstName'];

        $response2 = $this->createClientWithUser($appointment->repairer->owner)->request('GET', '/customers?firstName='.$customerFirstName)->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertLessThanOrEqual(count($response['hydra:member']), count($response2['hydra:member']));
    }

    public function testRepairerCanGetCustomersByLastName(): void
    {
        // appointment with at least 2 customers for a repairer expected according to fixtures
        $appointment = static::getContainer()->get(AppointmentRepository::class)->findOneBy(['repairer' => 13]);
        $response = $this->createClientWithUser($appointment->repairer->owner)->request('GET', '/customers')->toArray();

        $customerLastName = $response['hydra:member'][0]['lastName'];

        $response2 = $this->createClientWithUser($appointment->repairer->owner)->request('GET', '/customers?lastName='.$customerLastName)->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertLessThanOrEqual(count($response['hydra:member']), count($response2['hydra:member']));
    }
}
