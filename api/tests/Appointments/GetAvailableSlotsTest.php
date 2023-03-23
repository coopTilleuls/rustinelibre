<?php

namespace App\Tests\Appointments;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Appointment;
use App\Entity\Repairer;
use Doctrine\Bundle\DoctrineBundle\Registry;

class GetAvailableSlotsTest extends ApiTestCase
{
    public function testGetSlotsAvailable(): void
    {
        $randomRepairer = static::getContainer()->get('doctrine')->getRepository(Repairer::class)->findOneBy([]);
        $response = static::createClient()->request('GET', sprintf('/repairer_get_slots_available/%s?date[after]=20-03-2023&date[before]=30-03-2023', $randomRepairer->getId()));

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/Repairer',
            '@id' => '/repairer_get_slots_available/'.$randomRepairer->getId(),
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 63, // Should have 63 slots
        ]);

        $firstItem = $response->toArray()['hydra:member'][0];
        $this->assertEquals('2023-03-20T09:00:00+00:00', $firstItem['start']);
        $this->assertArrayHasKey('start', $firstItem);
        $this->assertArrayHasKey('end', $firstItem);
        $this->assertArrayHasKey('index', $firstItem);
    }

    public function testLessSlotsAvailable(): void
    {
        /** @var Registry $doctrine */
        $doctrine = static::getContainer()->get('doctrine');
        $randomRepairer = static::getContainer()->get('doctrine')->getRepository(Repairer::class)->findOneBy([]);

        // Create a new appointment between 20/03 and 30/03
        $appointment = new Appointment();
        $appointment->setRepairer($randomRepairer);
        $appointment->setSlotTime(new \DateTimeImmutable('2023-03-23T14:00:00'));
        $doctrine->getManager()->persist($appointment);
        $doctrine->getManager()->flush();

        $response = static::createClient()->request('GET', sprintf('/repairer_get_slots_available/%s?date[after]=20-03-2023&date[before]=30-03-2023', $randomRepairer->getId()));
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Should have 1 slot less
        $this->assertCount(62, $response->toArray()['hydra:member']);
    }
}
