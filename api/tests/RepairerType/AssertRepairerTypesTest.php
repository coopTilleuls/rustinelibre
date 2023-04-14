<?php

namespace App\Tests\RepairerType;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class AssertRepairerTypesTest extends AbstractTestCase
{
    public function testPostEmptyName(): void
    {
        $this->createClientAuthAsAdmin()->request('POST', '/repairer_types', ['json' => [
            'name' => '',
        ]]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertResponseIsUnprocessable('name: This value should not be blank');

    }

    public function testPostShortName(): void
    {
       $this->createClientAuthAsAdmin()->request('POST', '/repairer_types', ['json' => [
            'name' => 'a',
        ]]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertResponseIsUnprocessable('name: This value is too short. It should have 2 characters or more.');
    }

    public function testPostLongName(): void
    {
        $this->createClientAuthAsAdmin()->request('POST', '/repairer_types', ['json' => [
            'name' => 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eg',
        ]]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertResponseIsUnprocessable('name: This value is too long. It should have 80 characters or less.');
    }
}