<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Repairer;
use App\Repairers\Slots\ComputeAvailableSlotsByRepairer;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
final class BuildRepairerSlotsAvailableAction
{
    public function __construct(private ComputeAvailableSlotsByRepairer $computeAvailableSlotsByRepairer)
    {
    }

    public function __invoke(Repairer $repairer, Request $request): JsonResponse
    {
        $slotsAvailable = $this->computeAvailableSlotsByRepairer->buildArrayOfAvailableSlots(repairer: $repairer);

        return new JsonResponse($slotsAvailable);
    }
}
