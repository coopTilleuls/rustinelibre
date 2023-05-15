<?php

declare(strict_types=1);

namespace App\Tests\Appointments;


use ApiPlatform\Symfony\Bundle\Test\Client;
use App\Entity\Appointment;
use App\Entity\Repairer;
use App\Repository\AppointmentRepository;
use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;

class GetAvailableSlotsTest extends AbstractTestCase
{
    private Repairer $repairer;

    private AppointmentRepository $appointmentRepository;

    private Client $client;

    public function setUp(): void
    {
        parent::setUp();
        $this->client = self::createClient();
        $this->repairer = static::getContainer()->get(RepairerRepository::class)->findOneBy([]);
        $this->appointmentRepository = static::getContainer()->get(AppointmentRepository::class);
    }

    public function testGetSlotsAvailable(): void
    {
        // No need to be authenticated
        $response = $this->createClientAuthAsAdmin()->request('GET', sprintf('/repairer_get_slots_available/%s?date[after]=20-03-2023&date[before]=30-03-2023', $this->repairer->id));
        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        self::assertJsonContains([
            '@context' => '/contexts/Repairer',
            '@type' => 'hydra:Collection',
        ]);

        $firstItem = $response->toArray()['hydra:member'][0];
        $this->assertEquals('2023-03-20T09:00:00+00:00', $firstItem['start']);
        $this->assertArrayHasKey('start', $firstItem);
        $this->assertArrayHasKey('end', $firstItem);
        $this->assertArrayHasKey('index', $firstItem);
    }

    public function testLessSlotsAvailable(): void
    {
        $response = $this->client->request('GET', sprintf('/repairer_get_slots_available/%s?date[after]=20-03-2023&date[before]=30-03-2023', $this->repairer->id))->toArray();

        // Create a new appointment between 20/03 and 30/03
        $appointment = new Appointment();
        $appointment->repairer = $this->repairer;
        $appointment->slotTime = new \DateTimeImmutable('2023-03-23T14:00:00');
        $this->appointmentRepository->save($appointment, true);

        $response2 = $this->client->request('GET', sprintf('/repairer_get_slots_available/%s?date[after]=20-03-2023&date[before]=30-03-2023', $this->repairer->id))->toArray();
        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Should have 1 slot less
        $this->assertCount(count($response['hydra:member']) - 1, $response2['hydra:member']);
    }
}
