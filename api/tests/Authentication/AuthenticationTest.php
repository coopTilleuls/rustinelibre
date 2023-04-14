<?php

declare(strict_types=1);

namespace App\Tests\Authentication;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use Symfony\Component\HttpFoundation\Response;

class AuthenticationTest extends ApiTestCase
{
    public function testLogin(): void
    {
        $client = self::createClient();

        // No valid token given
        $client->request('GET', '/users');
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);

        // retrieve a token
        $response = $client->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'clement@les-tilleuls.coop',
                'password' => 'Test1passwordOk!',
            ],
        ]);

        $json = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertArrayHasKey('token', $json);

        $client->request('GET', '/users', ['auth_bearer' => $json['token']]);
        $this->assertResponseIsSuccessful();
    }

    public function testLoginFail(): void
    {
        $client = self::createClient();

        $client->request('POST', '/auth', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'clement@les-tilleuls.coop',
                'password' => 'toto_le_narvalo',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
        self::assertResponseHeaderSame('content-type', 'application/json');
        self::assertJsonEquals([
            'code' => 401,
            'message' => 'Invalid credentials.',
        ]);
    }
}
