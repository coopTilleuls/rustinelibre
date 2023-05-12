<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repairers\Slots\ComputeAvailableSlotsByRepairer;
use App\Repository\RepairerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

#[AsController]
final class BuildRepairerSlotsAvailableAction extends AbstractController
{
    public function __construct(private RepairerRepository $repairerRepository,
                                private ComputeAvailableSlotsByRepairer $computeAvailableSlotsByRepairer)
    {
    }

    public function __invoke(Request $request, string $id): JsonResponse
    {
        $repairer = $this->repairerRepository->find($id);

        if (!$repairer) {
            throw new NotFoundHttpException(sprintf('This repairer id (%s) does not exist', $id));
        }

        $slotsAvailable = $this->computeAvailableSlotsByRepairer->buildArrayOfAvailableSlots($repairer);

        return new JsonResponse($slotsAvailable);
    }
}
