<?php

declare(strict_types=1);

namespace App\Tests\Intervention;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class CreateInterventionTest extends AbstractTestCase
{
    public function testAdminCanPost(): void
    {
        $client = $this->createClientAuthAsAdmin();
        $client->request('POST', '/interventions', [
            'json' => [
                'description' => 'Une nouvelle intervention admin !',
                'isAdmin' => true
            ],
        ]);

        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'description' => 'Une nouvelle intervention admin !',
            'isAdmin' => true,
        ]);
    }
    
    public function testBossCannotPost(): void
    {
        $client = $this->createClientAuthAsBoss();
        $response = $client->request('POST', '/interventions', [
            'json' => [
                'description' => 'Une nouvelle intervention de boss !',
            ],
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testAdminSetPrice(): void
    {
        $client = $this->createClientAuthAsAdmin();
        $client->request('POST', '/create_repairer_interventions', [
            'json' => [
                'description' => 'Une nouvelle intervention admin !',
                'price' => 1000,
            ],
        ])->toArray();

        self::assertResponseIsSuccessful();
    }

    public function testBossCanPost(): void
    {
        $client = $this->createClientAuthAsBoss();
        $client->request('POST', '/create_repairer_interventions', [
            'json' => [
                'description' => 'Une nouvelle intervention boss !',
                'price' => 1000,
            ],
        ]);

        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'description' => 'Une nouvelle intervention boss !',
            'isAdmin' => false,
        ]);
    }

    public function testBossForgetsPrice(): void
    {
        $client = $this->createClientAuthAsBoss();
        $client->request('POST', '/create_repairer_interventions', [
            'json' => [
                'description' => 'Une nouvelle intervention boss !',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
    }

    public function testBossSetNegativePrice(): void
    {
        $client = $this->createClientAuthAsBoss();
        $client->request('POST', '/create_repairer_interventions', [
            'json' => [
                'description' => 'Une nouvelle intervention boss !',
                'price' => -1000,
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function testWithoutDescription(): void
    {
        $client = $this->createClientAuthAsBoss();
        $client->request('POST', '/create_repairer_interventions', [
            'json' => [
                'price' => 1000,
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function testUserCannotPost(): void
    {
        $client = $this->createClientAuthAsUser();
        $client->request('POST', '/create_repairer_interventions', [
            'json' => [
                'description' => 'Une nouvelle intervention !',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testUnauthenticatedCannotPost(): void
    {
        $client = self::createClient();
        $client->request('POST', '/create_repairer_interventions', [
            'json' => [
                'description' => 'Une nouvelle intervention !',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }
}
