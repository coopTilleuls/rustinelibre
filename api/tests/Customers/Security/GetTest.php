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
    // Repairer can get all his customers/ find customer by name / cannot get other customers/ admin can get all customers
    /** @var Appointment[] */
    protected array $appointments = [];

    private AppointmentRepository $appointmentRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->appointments = static::getContainer()->get(AppointmentRepository::class)->findAll();
        $this->appointmentRepository = static::getContainer()->get(AppointmentRepository::class);
    }

    public function testRepairerCanGetOwnCustomersCollection(): void
    {
        // repairer with at least 2 customers expected according to fixtures
        $repairerIdArray = $this->appointmentRepository->getRepairerWithMultipleCustomerAppointments();

        $repairer = static::getContainer()->get(RepairerRepository::class)->find($repairerIdArray[0]);

        $response = $this->createClientWithUser($repairer->owner)->request('GET', '/customers')->toArray();

        $this->assertResponseIsSuccessful();
        $this->assertGreaterThanOrEqual(2, count($response['hydra:member']));
        $this->assertLessThanOrEqual(count($this->appointments), count($response['hydra:member']));
    }

    public function testAdminCanGetCustomersCollection(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', '/customers');
        // 404 expected because this admin don't have repairer so should not have customers
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testRepairerCanGetCustomersByFirstName(): void
    {
        // repairer with at least 2 customers expected according to fixtures
        $repairerIdArray = $this->appointmentRepository->getRepairerWithMultipleCustomerAppointments();

        $repairer = static::getContainer()->get(RepairerRepository::class)->find($repairerIdArray[0]);
        $response = $this->createClientWithUser($repairer->owner)->request('GET', '/customers')->toArray();

        $customerFirstName = $response['hydra:member'][0]['firstName'];

        $response2 = $this->createClientWithUser($repairer->owner)->request('GET', '/customers?firstName='.$customerFirstName)->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertLessThanOrEqual(count($response['hydra:member']), count($response2['hydra:member']));
    }

    public function testRepairerCanGetCustomersByLastName(): void
    {
        // repairer with at least 2 customers expected according to fixtures
        $repairerIdArray = $this->appointmentRepository->getRepairerWithMultipleCustomerAppointments();

        $repairer = static::getContainer()->get(RepairerRepository::class)->find($repairerIdArray[0]);
        $response = $this->createClientWithUser($repairer->owner)->request('GET', '/customers')->toArray();

        $customerLastName = $response['hydra:member'][0]['lastName'];

        $response2 = $this->createClientWithUser($repairer->owner)->request('GET', '/customers?lastName='.$customerLastName)->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertLessThanOrEqual(count($response['hydra:member']), count($response2['hydra:member']));
    }
}
