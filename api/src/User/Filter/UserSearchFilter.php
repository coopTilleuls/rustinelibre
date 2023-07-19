<?php

declare(strict_types=1);

namespace App\User\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PropertyInfo\Type;
use Symfony\Component\Serializer\NameConverter\NameConverterInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

final class UserSearchFilter extends AbstractFilter
{
    public const PROPERTY_NAME = 'userSearch';

    public function __construct(private readonly TranslatorInterface $translator, ManagerRegistry $managerRegistry, LoggerInterface $logger = null, array $properties = null, NameConverterInterface $nameConverter = null)
    {
        parent::__construct($managerRegistry, $logger, $properties, $nameConverter);
    }

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        if (self::PROPERTY_NAME !== $property) {
            return;
        }

        if (!is_string($value)) {
            throw new BadRequestHttpException($this->translator->trans('400_badRequest.user.search.filter', domain: 'validators'));
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
