<?php

declare(strict_types=1);

namespace App\User\StateProvider;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Extension\QueryResultCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGenerator;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Repository\AppointmentRepository;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\TaggedIterator;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @template-implements ProviderInterface<User>
 */
final class CustomersProvider implements ProviderInterface
{
    public function __construct(
        private readonly Security $security,
        private readonly UserRepository $userRepository,
        private readonly AppointmentRepository $appointmentRepository,
        private readonly TranslatorInterface $translator,
        #[TaggedIterator('api_platform.doctrine.orm.query_extension.collection')] private readonly iterable $collectionExtensions = []
    ) {
    }

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array|null|object
    {
        /** @var User $user */
        $user = $this->security->getUser();
        $repairerFromEmployee = $user?->repairerEmployee?->repairer;
        $repairerFromBoss = $user?->repairer;
        if (!$repairerFromEmployee && !$repairerFromBoss) {
            throw new NotFoundHttpException($this->translator->trans('404_notFound.customer', domain:'validators'));
        }

        $customersIdsQueryBuilder = $this->appointmentRepository->getAppointmentCustomersIdsQueryBuilder();
        $customersQueryBuilder = $this->userRepository->getUsersInQbIdsByRepairer($customersIdsQueryBuilder, $repairerFromEmployee ?? $repairerFromBoss);
        $queryNameGenerator = new QueryNameGenerator();

        /** @var QueryCollectionExtensionInterface $extension */
        foreach ($this->collectionExtensions as $extension) {
            $extension->applyToCollection($customersQueryBuilder, $queryNameGenerator, User::class, $operation, $context);
            if ($extension instanceof QueryResultCollectionExtensionInterface && $extension->supportsResult(User::class, $operation, $context)) {
                return $extension->getResult($customersQueryBuilder, User::class, $operation, $context);
            }
        }

        return $customersQueryBuilder->getQuery()->getResult();
    }
}
