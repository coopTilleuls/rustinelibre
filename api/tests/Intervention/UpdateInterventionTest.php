<?php

declare(strict_types=1);

namespace App\Tests\Intervention;

use Symfony\Component\HttpFoundation\Response;

class UpdateInterventionTest extends InterventionAbstractTestCase
{
    public function testAdminCanPutAdminIntervention(): void
    {
        $id = $this->getAdminIntervention()->id;
        $client = $this->createClientAuthAsAdmin();
        $client->request('PUT', sprintf('/interventions/%d', $id), [
            'json' => [
                'description' => 'Intervention modifiée testAdminCanPutAdminIntervention !',
            ],
        ]);

        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'description' => 'Intervention modifiée testAdminCanPutAdminIntervention !',
            'isAdmin' => true,
        ]);
    }

    public function testAdminCanPutBossIntervention(): void
    {
        $intervention = $this->getBossAndHisIntervention()[1];
        $client = $this->createClientAuthAsAdmin();
        $client->request('PUT', sprintf('/interventions/%d', $intervention->id), [
            'json' => [
                'description' => 'Intervention modifiée testAdminCanPutBossIntervention !',
            ],
        ]);

        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'description' => 'Intervention modifiée testAdminCanPutBossIntervention !',
            'isAdmin' => false,
        ]);
    }

    public function testBossCanPutHisIntervention(): void
    {
        [$user, $intervention] = $this->getBossAndHisIntervention();
        $client = $this->createClientWithUser($user);
        $client->request('PUT', sprintf('/interventions/%d', $intervention->id), [
            'json' => [
                'description' => 'Intervention testBossCanPutHisIntervention !',
                'price' => 5000,
            ],
        ]);

        self::assertResponseIsSuccessful();
        self::assertJsonContains([
            'description' => 'Intervention testBossCanPutHisIntervention !',
            'isAdmin' => false,
        ]);
    }

    public function testBossCannotPutAdminIntervention(): void
    {
        $id = $this->getAdminIntervention()->id;
        $client = $this->createClientAuthAsBoss();
        $client->request('PUT', sprintf('/interventions/%d', $id), [
            'json' => [
                'description' => 'Intervention modifiée !',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testBossCannotPutOtherBossIntervention(): void
    {
        [$badBoss, $intervention] = $this->getBossAndOtherBossIntervention();
        $client = $this->createClientWithUser($badBoss);
        $client->request('PUT', sprintf('/interventions/%d', $intervention->id), [
            'json' => [
                'description' => 'Intervention modifiée !',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testUserCannotPutIntervention(): void
    {
        $intervention = $this->getBossAndHisIntervention()[1];
        $client = $this->createClientAuthAsUser();
        $client->request('PUT', sprintf('/interventions/%d', $intervention->id), [
            'json' => [
                'description' => 'Intervention modifiée !',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testUnauthenticatedCannotPutIntervention(): void
    {
        $intervention = $this->getBossAndHisIntervention()[1];
        $client = self::createClient();
        $client->request('PUT', sprintf('/interventions/%d', $intervention->id), [
            'json' => [
                'description' => 'Intervention modifiée !',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }
}
