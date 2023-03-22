<?php

namespace App\Appointments\StateProvider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Appointments\Services\AvailableSlotComputer;
use App\Repository\LocationRepository;

/**
 * @template-implements ProviderInterface<Operationv>
 */
final class LocationAvailableSlotsProvider implements ProviderInterface
{
    public function __construct(private AvailableSlotComputer $availableSlotComputer,
                                private LocationRepository $locationRepository)
    {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $location = $this->locationRepository->find($uriVariables['id']);

        if (!$location || !$location->getRrule()) {
            return [];
        }

        if (array_key_exists('filters', $context) && array_key_exists('date', $context['filters'])) {
            $startDate = $context['filters']['date']['after'] ?? null;
            $endDate = $context['filters']['date']['before'] ?? null;
        }

        return $this->availableSlotComputer->computeAvailableSlotsByLocation(
            $location,
            isset($startDate) ? new \DateTimeImmutable($startDate) : new \DateTimeImmutable(sprintf('+%d minutes', $location->getMinimumPreparationDelay())),
            isset($endDate) ? new \DateTimeImmutable($endDate) : new \DateTimeImmutable('+1 week')
        );
    }
}
