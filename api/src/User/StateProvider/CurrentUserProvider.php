<?php

declare(strict_types=1);

namespace App\User\StateProvider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Appointments\Services\AvailableSlotComputer;
use App\Repository\RepairerRepository;
use Recurr\Recurrence;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Security\Csrf\TokenStorage\TokenStorageInterface;

/**
 * @template-implements ProviderInterface<Operation>
 */
final class CurrentUserProvider implements ProviderInterface
{
    public function __construct(private TokenStorageInterface $tokenStorage)
    {
    }

    /**
     * @return array<int, Recurrence>
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
            isset($startDate) ? new \DateTimeImmutable($startDate) : new \DateTimeImmutable(),
            isset($endDate) ? new \DateTimeImmutable($endDate) : new \DateTimeImmutable('+1 week')
        );
    }
}
