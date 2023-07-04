<?php

declare(strict_types=1);

namespace App\Tests\RepairerType;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;

class AssertRepairerTypesTest extends AbstractTestCase
{
    private TranslatorInterface $translator;

    public function setUp(): void
    {
        parent::setUp();
        $this->translator = static::getContainer()->get(TranslatorInterface::class);
    }

    public function testPostEmptyName(): void
    {
        $this->createClientAuthAsAdmin()->request('POST', '/repairer_types', ['json' => [
        ]]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => sprintf('name: %s', $this->translator->trans('repairerType.name.not_blank', domain: 'validators')),
        ]);
    }

    public function testPostShortName(): void
    {
        $this->createClientAuthAsAdmin()->request('POST', '/repairer_types', ['json' => [
             'name' => 'a',
         ]]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => sprintf('name: %s', $this->translator->trans('repairerType.name.min_length', domain: 'validators')),
        ]);
    }

    public function testPostLongName(): void
    {
        $this->createClientAuthAsAdmin()->request('POST', '/repairer_types', ['json' => [
            'name' => 'Lorem ipsum dolor sit amet, consectetuer adipiscing.',
        ]]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => sprintf('name: %s', $this->translator->trans('repairerType.name.max_length', domain: 'validators')),
        ]);
    }
}
