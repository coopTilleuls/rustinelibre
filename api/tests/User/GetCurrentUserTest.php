<?php

declare(strict_types=1);

namespace App\Tests\User;

use App\Tests\AbstractTestCase;

class GetCurrentUserTest extends AbstractTestCase
{
    public function testGetCurrentUser(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', sprintf('/me'));
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/User',
            '@id' => '/me',
            '@type' => 'User',
            'email' => 'clement@les-tilleuls.coop',
        ]);
    }

    public function testGetCurrentUserWithoutAuth(): void
    {
        static::createClient()->request('GET', sprintf('/me'));
        $this->assertResponseStatusCodeSame(404);
    }
}
