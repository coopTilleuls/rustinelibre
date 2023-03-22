<?php

namespace App\Tests\Appointments;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Appointment;
use App\Entity\Location;
use Doctrine\Bundle\DoctrineBundle\Registry;

class GetAvailableSlotsTest extends ApiTestCase
{
    public function testGetSlotsAvailable(): void
    {
        $randomLocation = static::getContainer()->get('doctrine')->getRepository(Location::class)->findOneBy([]);
        $response = static::createClient()->request('GET', sprintf('/locations_get_slots_available/%s?date[after]=20-03-2023&date[before]=30-03-2023', $randomLocation->getId()));

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/Location',
            '@id' => '/locations_get_slots_available/'.$randomLocation->getId(),
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 63, // Should have 63 slots
        ]);

        $this->assertArrayHasKey('start', $response->toArray()['hydra:member'][0]);
        $this->assertArrayHasKey('end', $response->toArray()['hydra:member'][0]);
        $this->assertArrayHasKey('index', $response->toArray()['hydra:member'][0]);
    }

    public function testLessSlotsAvailable(): void
    {
        /** @var Registry $doctrine */
        $doctrine = static::getContainer()->get('doctrine');
        $randomLocation = $doctrine->getRepository(Location::class)->findOneBy([]);

        // Create a new appointment between 20/03 and 30/03
        $appointment = new Appointment();
        $appointment->setLocation($randomLocation);
        $appointment->setSlotTime(new \DateTimeImmutable('2023-03-23T14:00:00'));
        $doctrine->getManager()->persist($appointment);
        $doctrine->getManager()->flush();

        $response = static::createClient()->request('GET', sprintf('/locations_get_slots_available/%s?date[after]=20-03-2023&date[before]=30-03-2023', $randomLocation->getId()));
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Should have 1 slot less
        $this->assertCount(62, $response->toArray()['hydra:member']);
    }
}
