<?php

declare(strict_types=1);

namespace App\Repairers\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\PropertyInfo\Type;

class RandomFilter extends AbstractFilter
{
    public const PROPERTY_NAME = 'sort';

    public const VALUE_NAME = 'random';

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        if (self::PROPERTY_NAME !== $property || self::VALUE_NAME !== $value) {
            return;
        }

        $queryBuilder->addSelect('RANDOM() as HIDDEN rand')
            ->addOrderBy('rand');
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description['random'] = [
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Filter to get data with random order. This filter should be placed in entity only at latest to avoid overide of other filters.',
                'openapi' => [
                    'example' => '/repairers?sort=random',
                    'allowReserved' => false,
                    'allowEmptyValue' => false,
                    'explode' => false,
                ],
            ];
        }

        return $description;
    }
}
