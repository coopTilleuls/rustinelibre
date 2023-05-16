<?php

declare(strict_types=1);

namespace App\Maintenance\Doctrine;

use ApiPlatform\Doctrine\Orm\Extension\QueryCollectionExtensionInterface;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use App\Entity\Maintenance;
use Doctrine\ORM\QueryBuilder;
use Symfony\Bundle\SecurityBundle\Security;

/**
 * This extension prevents getting maintenances from other users.
 */
final class MaintenanceExtension implements QueryCollectionExtensionInterface
{
    public function __construct(private readonly Security $security)
    {
    }

    public function applyToCollection(QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        $this->addWhere($queryBuilder, $resourceClass);
    }

    private function addWhere(QueryBuilder $queryBuilder, string $resourceClass): void
    {
        if (Maintenance::class !== $resourceClass || $this->security->isGranted('ROLE_ADMIN') || $this->security->isGranted('ROLE_BOSS') || null === $user = $this->security->getUser()) {
            return;
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $queryBuilder->leftJoin(sprintf('%s.bike', $rootAlias), 'ob');
        $queryBuilder->andWhere('ob.owner = :current_user');
        $queryBuilder->setParameter('current_user', $user->id);
    }
}
