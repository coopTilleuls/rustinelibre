<?php

declare(strict_types=1);

namespace App\User\StateProvider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Repository\AppointmentRepository;
use App\Repository\RepairerRepository;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * @template-implements ProviderInterface<User>
 */
final class CurrentUserProvider implements ProviderInterface
{
    public function __construct(
        private Security $security,
        private AppointmentRepository $appointmentRepository,
        private RepairerRepository $repairerRepository,
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): ?User
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            return null;
        }

        $threeLastRepairersIds = $this->appointmentRepository->getThreeLastAppointmentsRepairersIds($user);
        $user->lastRepairers = $this->repairerRepository->findRepairersInIds(ids: $threeLastRepairersIds);

        return $user;
    }
}
