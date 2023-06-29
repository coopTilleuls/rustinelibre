<?php

declare(strict_types=1);

namespace App\Repairers\Filter;

use ApiPlatform\Doctrine\Orm\Filter\AbstractFilter;
use ApiPlatform\Doctrine\Orm\Util\QueryNameGeneratorInterface;
use ApiPlatform\Metadata\Operation;
use Doctrine\ORM\QueryBuilder;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PropertyInfo\Type;
use Symfony\Contracts\Translation\TranslatorInterface;

class FirstSlotAvailableFilter extends AbstractFilter
{
    public const PROPERTY_NAME = 'availability';

    private readonly TranslatorInterface $translator;

    protected function filterProperty(string $property, $value, QueryBuilder $queryBuilder, QueryNameGeneratorInterface $queryNameGenerator, string $resourceClass, Operation $operation = null, array $context = []): void
    {
        if (self::PROPERTY_NAME !== $property) {
            return;
        }

        if (!in_array($value, ['DESC', 'ASC'], true)) {
            throw new BadRequestHttpException($this->translator->trans('400_badRequest.availability.filter', domain: 'validators'));
        }

        $queryBuilder->addOrderBy('o.firstSlotAvailable', $value);
    }

    public function getDescription(string $resourceClass): array
    {
        if (!$this->properties) {
            return [];
        }

        $description = [];
        foreach ($this->properties as $property => $strategy) {
            $description['availability'] = [
                'type' => Type::BUILTIN_TYPE_STRING,
                'required' => false,
                'description' => 'Order by first available slot.',
                'openapi' => [
                    'example' => '/repairers?availability=ASC|DESC',
                    'allowReserved' => false,
                    'allowEmptyValue' => false,
                    'explode' => false,
                ],
            ];
        }

        return $description;
    }
}
