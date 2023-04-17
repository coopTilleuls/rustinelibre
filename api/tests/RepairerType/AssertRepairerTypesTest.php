<?php

namespace App\Tests\RepairerType;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class AssertRepairerTypesTest extends AbstractTestCase
{
    public function testPostEmptyName(): void
    {
        $this->createClientAuthAsAdmin()->request('POST', '/repairer_types', ['json' => [
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
        $this->createClientAuthAsAdmin()->request('POST', '/repairer_types', ['json' => [
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
        $this->createClientAuthAsAdmin()->request('POST', '/repairer_types', ['json' => [
            'name' => 'Lorem ipsum dolor sit amet, consectetuer adipiscing.',
        ]]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value is too long. It should have 50 characters or less.',
        ]);
    }
}
