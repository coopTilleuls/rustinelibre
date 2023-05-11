<?php

declare(strict_types=1);

namespace App\Repairers\Slots;

use App\Appointments\Services\AvailableSlotComputer;
use App\Controller\BuildRepairerSlotsAvailableAction;
use App\Entity\Repairer;
use Doctrine\ORM\EntityManagerInterface;
use Recurr\Recurrence;

final class FirstSlotAvailableCalculator
{
    public function __construct(private readonly SlotsAvailableBuilder $slotsAvailableBuilder,
                                private EntityManagerInterface $entityManager)
    {
    }

    public function setFirstSlotAvailable(Repairer $repairer, ?bool $flush = false): void
    {
        /** @var array<string, array<int, string>> $slotsAvailable */
        $slotsAvailable = $this->slotsAvailableBuilder->buildArrayOfAvailableSlots($repairer);

        if (!empty($slotsAvailable)) {
            $day = key($slotsAvailable);
            $time = reset($slotsAvailable[$day]);
            $newFirstSlotAvailable = new \DateTime(sprintf('%s %s', $day, $time));
        }

        $repairer->firstSlotAvailable = $newFirstSlotAvailable ?? null;

        if ($flush) {
            $this->entityManager->persist($repairer);
            $this->entityManager->flush();
        }
    }
}
