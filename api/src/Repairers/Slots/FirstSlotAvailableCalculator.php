<?php

declare(strict_types=1);

namespace App\Repairers\Slots;

use App\Appointments\Services\AvailableSlotComputer;
use App\Entity\Repairer;
use Doctrine\ORM\EntityManagerInterface;
use Recurr\Recurrence;

final class FirstSlotAvailableCalculator
{
    public function __construct(private readonly AvailableSlotComputer $availableSlotComputer,
                                private readonly EntityManagerInterface $entityManager)
    {
    }

    /**
     * @return array<int, Recurrence>
     */
    public function setFirstSlotAvailable(Repairer $repairer): void
    {
        /** @var array<int, Recurrence> $slotsAvailable */
        $slotsAvailable = $this->availableSlotComputer->computeAvailableSlotsByRepairer($repairer, new \DateTimeImmutable(), new \DateTimeImmutable('+1 month'));
        if (!empty($slotsAvailable)) {

            $firstSlotAvailable = array_shift($slotsAvailable)->getStart();
        }

        $repairer->setFirstSlotAvailable($firstSlotAvailable ?? null);
        $this->entityManager->flush();
    }
}
