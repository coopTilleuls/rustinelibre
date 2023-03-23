<?php

namespace App\Appointments\StateProvider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Appointments\Services\AvailableSlotComputer;
use App\Repository\RepairerRepository;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @template-implements ProviderInterface<Operation>
 */
final class RepairerAvailableSlotsProvider implements ProviderInterface
{
    public function __construct(private AvailableSlotComputer $availableSlotComputer,
                                private RepairerRepository $repairerRepository)
    {
    }

    /**
     * @return array<string, mixed>
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $repairer = $this->repairerRepository->find($uriVariables['id']);

        if (!$repairer) {
            throw new NotFoundHttpException(sprintf('This repairer id (%s) does not exist', $uriVariables['id']));
        }

        if (!$repairer->getRrule()) {
            return [];
        }

        if (array_key_exists('filters', $context) && array_key_exists('date', $context['filters'])) {
            $startDate = $context['filters']['date']['after'] ?? null;
            $endDate = $context['filters']['date']['before'] ?? null;
        }

        return $this->availableSlotComputer->computeAvailableSlotsByRepairer(
            $repairer,
            isset($startDate) ? new \DateTimeImmutable($startDate) : new \DateTimeImmutable(sprintf('+%d minutes', $repairer->getMinimumPreparationDelay())),
            isset($endDate) ? new \DateTimeImmutable($endDate) : new \DateTimeImmutable('+1 week')
        );
    }
}
