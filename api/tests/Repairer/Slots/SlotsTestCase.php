<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Slots;

use App\Entity\Repairer;
use App\Repairers\Service\UpdateOldFirstSlotAvailableService;
use App\Repository\AppointmentRepository;
use App\Repository\BikeTypeRepository;
use App\Repository\RepairerRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use App\Tests\Trait\BikeTypeTrait;

class SlotsTestCase extends AbstractTestCase
{
    use BikeTypeTrait;

    public const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    public UserRepository $userRepository;
    public RepairerRepository $repairerRepository;
    public AppointmentRepository $appointmentRepository;
    public UpdateOldFirstSlotAvailableService $updateOldFirstSlotAvailableService;

    public function setUp(): void
    {
        parent::setUp();
        $this->userRepository = static::getContainer()->get(UserRepository::class);
        $this->repairerRepository = static::getContainer()->get(RepairerRepository::class);
        $this->appointmentRepository = static::getContainer()->get(AppointmentRepository::class);
        $this->bikeTypeRepository = static::getContainer()->get(BikeTypeRepository::class);
        $this->updateOldFirstSlotAvailableService = static::getContainer()->get(UpdateOldFirstSlotAvailableService::class);
        $this->updateOldFirstSlotAvailableService->updateOldFirstSlotAvailable();
    }

    public function getRepairerWithSlotsAvailable(int $numberSlotsAvailable = 4): Repairer
    {
        if ($numberSlotsAvailable > 4) {
            self::fail('Number of slots available must be less than 4');
        }
        $user = $this->userRepository->getUserWithoutRepairer();
        $bikeType = $this->getBikeType();
        $client = $this->createClientWithUser($user);
        $adminClient = $this->createClientAuthAsAdmin();

        // create new repairer
        $repairer = $client->request('POST', '/repairers', [
            'json' => [
                'name' => 'Chez Jeje',
                'description' => 'On aime réparer des trucs',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la clé',
                'city' => 'Lille',
                'postcode' => '59000',
                'latitude' => '50.62544631958008',
                'longitude' => '3.0352721214294434',
                'country' => 'France',
                'slotsDuration' => 60,
                'numberOfSlots' => 4,
                'bikeTypesSupported' => [sprintf('/bike_types/%s', $bikeType->id)],
            ],
        ])->toArray();

        // add opening hours for this repairer
        foreach (self::DAYS as $day) {
            $adminClient->request('POST', '/repairer_opening_hours', [
                'json' => [
                    'repairer' => sprintf('/repairers/%d', $repairer['id']),
                    'day' => $day,
                    'startTime' => '21:00',
                    'endTime' => '23:00',
                ],
            ]);
        }

        // get again repairer for firstSlotAvailable updated
        $repairer = $client->request('GET', sprintf('/repairers/%d', $repairer['id']))->toArray();

        // create appointments for this repairer
        for ($i = $numberSlotsAvailable; $i < 4; ++$i) {
            $client->request('POST', '/appointments', [
                'json' => [
                    'repairer' => sprintf('/repairers/%d', $repairer['id']),
                    'slotTime' => (new \DateTimeImmutable($repairer['firstSlotAvailable']))->format('Y-m-d H:i:s'),
                ],
            ]);
        }

        return $this->repairerRepository->find($repairer['id']);
    }
}
