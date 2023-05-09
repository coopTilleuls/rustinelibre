<?php

declare(strict_types=1);

namespace App\User\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PropertyInfo\Type;

final class UserSearchFilter extends AbstractFilter
{
    public const PROPERTY_NAME = 'userSearch';

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        if (self::PROPERTY_NAME !== $property) {
            return;
        }

        if (!is_string($value)) {
            throw new BadRequestHttpException('Wrong format provided for user search, should be a string as : ?userSearch=raphael');
        }

        $rootAlias = $queryBuilder->getRootAliases()[0];
        $queryBuilder->andWhere(sprintf('LOWER(%s.firstName) LIKE :searchTerms OR LOWER(%s.lastName) LIKE :searchTerms OR LOWER(%s.email) LIKE :searchTerms', $rootAlias, $rootAlias, $rootAlias));
        $queryBuilder->setParameter('searchTerms', '%'.strtolower($value).'%');
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description['userSearch'] = [
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Filter to get user by first name, last name or email',
                'openapi' => [
                    'example' => '/userSearch=raphael',
                    'allowReserved' => false,
                    'allowEmptyValue' => true,
                    'explode' => false,
                ],
            ];
        }

        return $description;
    }
}
