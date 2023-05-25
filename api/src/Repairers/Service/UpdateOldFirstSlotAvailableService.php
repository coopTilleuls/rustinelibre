<?php

declare(strict_types=1);

namespace App\Repairers\Service;

use App\Entity\Repairer;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use App\Repository\RepairerRepository;
use Psr\Log\LoggerInterface;

readonly class UpdateOldFirstSlotAvailableService
{
    public function __construct(
        private RepairerRepository $repairerRepository,
        private FirstSlotAvailableCalculator $firstSlotAvailableCalculator,
        private LoggerInterface $logger,
    ) {
    }

    public function updateOldFirstSlotAvailable(): void
    {
        /** @var Repairer[] $repairers */
        $repairers = $this->repairerRepository->findByOldFirstSlotAvailable();

        foreach ($repairers as $repairer) {
            if ($repairer->firstSlotAvailable < new \DateTime('now')) {
                $this->logger->info(sprintf('Update $firstSlotAvailable for repairer %d', $repairer->id));
                $this->firstSlotAvailableCalculator->setFirstSlotAvailable($repairer, true);
            }
        }
    }
}
