<?php

declare(strict_types=1);

namespace App\Tests\BikeType;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class AssertBikeTypeTest extends AbstractTestCase
{
    public function testPostEmptyName(): void
    {
        $this->createClientAuthAsAdmin()->request('POST', '/bike_types', ['json' => [
        ]]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value should not be blank.',
        ]);
    }

    public function testPostShortName(): void
    {
        $this->createClientAuthAsAdmin()->request('POST', '/bike_types', ['json' => [
            'name' => 'a',
        ]]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value is too short. It should have 2 characters or more.',
        ]);
    }

    public function testPostLongName(): void
    {
        $this->createClientAuthAsAdmin()->request('POST', '/bike_types', ['json' => [
            'name' => 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean mas',
        ]]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value is too long. It should have 100 characters or less.',
        ]);
    }
}
