<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Repairer;
use App\Repairers\Slots\ComputeAvailableSlotsByRepairer;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
final class BuildRepairerSlotsAvailableAction
{
    public function __construct(private ComputeAvailableSlotsByRepairer $computeAvailableSlotsByRepairer)
    {
    }

    #[ParamConverter('repairer', class: Repairer::class)]
    public function __invoke(Request $request, Repairer $repairer): JsonResponse
    {
        $slotsAvailable = $this->computeAvailableSlotsByRepairer->buildArrayOfAvailableSlots($repairer);

        return new JsonResponse($slotsAvailable);
    }
}
