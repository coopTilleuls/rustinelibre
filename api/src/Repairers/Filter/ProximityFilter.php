<?php

declare(strict_types=1);

namespace App\Repairers\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PropertyInfo\Type;

final class ProximityFilter extends AbstractFilter
{
    public const PROPERTY_NAME = 'proximity';

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        if (self::PROPERTY_NAME !== $property) {
            return;
        }

        try {
            $coordinates = explode(',', $value);
            $latitude = $coordinates[0];
            $longitude = $coordinates[1];
        } catch (\Exception $exception) {
            throw new BadRequestHttpException('TThe parameters provided in the proximity filter have the wrong format, it should be ?proximity=50.43321,3.03943');
        }

        $queryBuilder->addSelect(sprintf('ST_Distance(o.gpsPoint, ST_SetSRID(ST_MakePoint(%s, %s), 4326)) as distance', $latitude, $longitude));
        $queryBuilder->addOrderBy('distance', 'ASC');
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description['proximity'] = [
                'property' => $property,
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Filter to get data order by proximity from a given latitude/longitude. Default order is ASC',
                'openapi' => [
                    'example' => '/repairers?proximity=<latitude,longitude>',
                    'allowReserved' => false,
                    'allowEmptyValue' => true,
                    'explode' => false,
                ],
            ];
        }

        return $description;
    }
}
