<?php

declare(strict_types=1);

namespace App\Tests\Appointments;

use App\Entity\Appointment;
use App\Entity\Repairer;
use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;
use Doctrine\Bundle\DoctrineBundle\Registry;

class GetAvailableSlotsTest extends AbstractTestCase
{
    private ?Repairer $repairer = null;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairer = static::getContainer()->get(RepairerRepository::class)->findAll()[0];
    }

    public function testGetSlotsAvailable(): void
    {
        // No need to be authenticated
        $response = static::createClientAuthAsAdmin()->request('GET', sprintf('/repairer_get_slots_available/%s?date[after]=20-03-2023&date[before]=30-03-2023', $this->repairer->getId()));
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/Repairer',
            '@type' => 'hydra:Collection',
            'hydra:totalItems' => 63,
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

        // Create a new appointment between 20/03 and 30/03
        $appointment = new Appointment();
        $appointment->setRepairer($this->repairer);
        $appointment->setSlotTime(new \DateTimeImmutable('2023-03-23T14:00:00'));
        $doctrine->getManager()->persist($appointment);
        $doctrine->getManager()->flush();

        $response = static::createClient()->request('GET', sprintf('/repairer_get_slots_available/%s?date[after]=20-03-2023&date[before]=30-03-2023', $this->repairer->getId()));
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Should have 1 slot less
        $this->assertCount(62, $response->toArray()['hydra:member']);
    }
}
