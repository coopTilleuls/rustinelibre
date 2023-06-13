<?php

declare(strict_types=1);

namespace App\Tests\User;

use App\Tests\AbstractTestCase;
use DateTime;
use Symfony\Component\HttpFoundation\Response;

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
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);
    }

    public function testGetLastConnection(): void
    {
        $response = $this->createClientAuthAsUser()->request('GET', '/me')->toArray();
        $this->assertResponseIsSuccessful();

        $dateTime = \DateTime::createFromFormat(\DateTimeInterface::ATOM, $response['lastConnect']);
        // Will be false if $response['lastConnect'] is not a dateTime
        $this->assertNotFalse($dateTime);
    }

    public function testLastThreeRepairers(): void
    {
        $response = $this->createClientAuthAsUser()->request('GET', sprintf('/me'))->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
        $this->assertIsArray($response['lastRepairers']);
    }
}
