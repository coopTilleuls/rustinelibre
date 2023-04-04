<?php

declare(strict_types=1);

namespace App\Repairers\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PropertyInfo\Type;

final class AroundFilter extends AbstractFilter
{
    public const PROPERTY_NAME = 'around';

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        if (self::PROPERTY_NAME !== $property) {
            return;
        }

        if (!property_exists($resourceClass, 'latitude') || !property_exists($resourceClass, 'longitude')) {
            throw new BadRequestHttpException(sprintf('Your resource class %s has no latitude or longitude property', $resourceClass));
        }

        if (!is_array($value) || empty($value)) {
            throw new BadRequestHttpException('Wrong format provided for the filter, should be : ?around[distance]=latitude,longitude');
        }

        $distance = key($value);
        $coordinates = explode(',', $value[$distance]);

        $queryBuilder->orWhere($queryBuilder->expr()->eq(
            'ST_DWithin(
                    o.gpsPoint,
                    ST_SetSRID(ST_MakePoint(:around_latitude, :around_longitude), 4326),
                    :around_distance
                )', 'true'));
        $queryBuilder->setParameter('around_latitude', $coordinates[0]);
        $queryBuilder->setParameter('around_longitude', $coordinates[1]);
        $queryBuilder->setParameter('around_distance', $distance);
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description['around'] = [
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Filter to get points around given GPS coordinates',
                'openapi' => [
                    'example' => '/repairers?around[distance]=latitude,longitude',
                    'allowReserved' => false,
                    'allowEmptyValue' => true,
                    'explode' => false,
                ],
            ];
        }

        return $description;
    }
}
