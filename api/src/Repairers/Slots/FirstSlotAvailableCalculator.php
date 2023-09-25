<?php

declare(strict_types=1);

namespace App\Repairers\Slots;

use App\Entity\Repairer;
use Doctrine\ORM\EntityManagerInterface;

final class FirstSlotAvailableCalculator
{
    public function __construct(
        private readonly ComputeAvailableSlotsByRepairer $computeAvailableSlotsByRepairer,
        private EntityManagerInterface $entityManager)
    {
    }

    /**
     * @param ?array<string, array<int, string>> $slotsAvailable
     */
    public function setFirstSlotAvailable(Repairer $repairer, ?bool $flush = false, array $slotsAvailable = null): void
    {
        if (null === $slotsAvailable) {
            $slotsAvailable = $this->computeAvailableSlotsByRepairer->buildArrayOfAvailableSlots(repairer: $repairer);
        }

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
