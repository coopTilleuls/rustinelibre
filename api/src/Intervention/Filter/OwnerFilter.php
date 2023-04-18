<?php

declare(strict_types=1);

namespace App\Intervention\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\PropertyInfo\Type;

class OwnerFilter extends AbstractFilter
{
    public const PROPERTY_NAME = 'owner';

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        if (self::PROPERTY_NAME !== $property) {
            return;
        }

        $queryBuilder->innerJoin('o.repairerInterventions', 'ri')
            ->innerJoin('ri.repairer', 'r')
            ->andWhere('r.owner = :owner')
            ->setParameter('owner', $value);
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $strategy) {
            $description['owner'] = [
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Allow to filter by boss ID',
                'openapi' => [
                    'example' => '/interventions?owner=12',
                    'allowReserved' => false,
                    'allowEmptyValue' => false,
                    'explode' => false,
                ],
            ];
        }

        return $description;
    }
}
