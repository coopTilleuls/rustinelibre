<?php

declare(strict_types=1);

namespace App\Repairers\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\PropertyInfo\Type;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class AroundFilter extends AbstractFilter
{
    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        if (!property_exists($resourceClass, 'latitude') || !property_exists($resourceClass, 'longitude')) {
            throw new BadRequestHttpException(sprintf('Your resource class %s has no latitude or longitude property', $resourceClass));
        }

        if (!is_array($value) || empty($value)) {
            throw new BadRequestHttpException("Wrong format provided for the filter, should be : ?around[distance]=latitude,longitude");
        }

        $distance = key($value);
        $coordinates = explode(',', $value[$distance]);

        $queryBuilder->where($queryBuilder->expr()->eq(
            sprintf(
                "ST_DWithin(
                    o.gpsPoint,
                    ST_SetSRID(ST_MakePoint(%s, %s), 4326),
                    %s
                )", $coordinates[0], $coordinates[1], $distance
                )
            , 'true'));
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description["around"] = [
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