<?php

declare(strict_types=1);

namespace App\Tests\Repairer\SlotsAvailable;

use App\Entity\Repairer;
use App\Repository\RepairerOpeningHoursRepository;
use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;

class GetSlotsAvailableTest extends AbstractTestCase
{
    private RepairerRepository $repairerRepository;

    private RepairerOpeningHoursRepository $repairerOpeningHoursRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerRepository = static::getContainer()->get(RepairerRepository::class);
        $this->repairerOpeningHoursRepository = static::getContainer()->get(RepairerOpeningHoursRepository::class);
    }

    public function testSlotsAvailableAreUpdatedAfterOpeningHoursCreation(): void
    {
        /** @var Repairer $repairer */
        $repairer = $this->repairerRepository->findOneBy([]);
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();

        $client->request('POST', '/repairer_opening_hours', ['json' => [
            'repairer' => sprintf('/repairers/%d', $repairer->id),
            'day' => 'saturday',
            'startTime' => '02:00',
            'endTime' => '03:00',
        ]]);

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse, $secondResponse);
    }

    public function testSlotsAvailableAreUpdatedAfterOpeningHoursDeletion(): void
    {
        /** @var Repairer $repairer */
        $repairer = $this->repairerRepository->findOneBy([]);
        $roh = $this->repairerOpeningHoursRepository->findOneBy(['repairer' => $repairer->id]);
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();

        $client->request('DELETE', sprintf('/repairer_opening_hours/%d', $roh->id));

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse, $secondResponse);
    }

    public function testSlotsAvailableAreUpdateAfterExceptionalClosureCreation(): void
    {
        /** @var Repairer $repairer */
        $repairer = $this->repairerRepository->findOneBy([]);
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();

        $client->request('POST', '/repairer_exceptional_closures', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'startDate' => (new \DateTime('+15 days'))->format('Y-m-d'),
                'endDate' => (new \DateTime('+30 days'))->format('Y-m-d'),
            ],
        ]);

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse, $secondResponse);
    }

    public function testSlotsAvailableAreUpdateAfterNewAppointment(): void
    {
        /** @var Repairer $repairer */
        $repairer = $this->repairerRepository->findOneBy([]);
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($firstResponse), $firstResponse[array_key_first($firstResponse)][0]);

        $client->request('POST', '/appointments', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s '),
            ],
        ]);

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($firstResponse, $secondResponse);
    }

    public function testSlotsAvailableAreUpdateAfterAppointmentDeletion(): void
    {
        /** @var Repairer $repairer */
        $repairer = $this->repairerRepository->findOneBy([]);
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($firstResponse), $firstResponse[array_key_first($firstResponse)][0]);

        $appointmentResponse = $client->request('POST', '/appointments', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s '),
            ],
        ])->toArray();

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();

        $client->request('DELETE', sprintf('/appointments/%d', $appointmentResponse['id']));

        $thirdResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($thirdResponse, $secondResponse);
    }

    public function testSlotsAvailableAreUpdateAfterAppointmentRefusal(): void
    {
        /** @var Repairer $repairer */
        $repairer = $this->repairerRepository->findOneBy([]);
        $client = $this->createClientAuthAsAdmin();

        $firstResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $slotTime = sprintf('%s %s', array_key_first($firstResponse), $firstResponse[array_key_first($firstResponse)][0]);

        $appointmentResponse = $client->request('POST', '/appointments', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d H:i', $slotTime)->format('Y-m-d H:i:s '),
            ],
        ])->toArray();

        $secondResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();

        $client->request('PUT', sprintf('/appointments/%d', $appointmentResponse['id']), [
            'json' => [
                'accepted' => false,
            ],
        ]);

        $thirdResponse = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        self::assertNotSame($thirdResponse, $secondResponse);
    }

    public function testGetOnlySlotsAvailableNotStarted(): void
    {
        /** @var Repairer $repairer */
        $repairer = $this->repairerRepository->findOneBy([]);
        $rohs = $this->repairerOpeningHoursRepository->findBy(['repairer' => $repairer->id]);
        $client = $this->createClientAuthAsAdmin();

        foreach ($rohs as $roh) {
            // reset opening hours
            $client->request('DELETE', sprintf('/repairer_opening_hours/%d', $roh->id));
        }

        // create opening hours for all day
        $client->request('POST', '/repairer_opening_hours', ['json' => [
            'repairer' => sprintf('/repairers/%d', $repairer->id),
            'day' => strtolower((new \DateTimeImmutable())->format('l')),
            'startTime' => '00:00',
            'endTime' => '23:30',
        ]]);

        $response = $client->request('GET', sprintf('/repairer_get_slots_available/%d', $repairer->id))->toArray();
        $today = $response[(new \DateTimeImmutable())->format('Y-m-d')];
        foreach ($today as $time) {
            // check if all slots available are not started
            self::assertGreaterThan((new \DateTimeImmutable())->format('H:i'), $time);
        }
    }
}
