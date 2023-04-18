<?php

declare(strict_types=1);

namespace App\Tests\Intervention;

use Symfony\Component\HttpFoundation\Response;

class DeleteInterventionTest extends InterventionAbstractTestCase
{
    public function testAdminCanDeleteAdminIntervention(): void
    {
        $id = $this->getAdminIntervention()->id;
        $client = $this->createClientAuthAsAdmin();
        $client->request('DELETE', sprintf('/interventions/%s', $id));

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testBossCannotDeleteAdminIntervention(): void
    {
        $id = $this->getAdminIntervention()->id;
        $client = $this->createClientAuthAsBoss();
        $client->request('DELETE', sprintf('/interventions/%s', $id));

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testBossCanDeleteHisIntervention(): void
    {
        [$user, $intervention] = $this->getBossAndHisIntervention();
        $client = $this->createClientWithUser($user);
        $client->request('DELETE', sprintf('/interventions/%s', $intervention->id));

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testBossCannotDeleteOtherBossIntervention(): void
    {
        [$badBoss, $intervention] = $this->getBossAndOtherBossIntervention();
        $client = $this->createClientWithUser($badBoss);
        $client->request('DELETE', sprintf('/interventions/%s', $intervention->id));

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testUserCannotDeleteIntervention(): void
    {
        $intervention = $this->getBossAndHisIntervention()[1];
        $client = $this->createClientAuthAsUser();
        $client->request('DELETE', sprintf('/interventions/%s', $intervention->id));

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testUnauthenticatedCannotDeleteIntervention(): void
    {
        $intervention = $this->getBossAndHisIntervention()[1];
        $client = self::createClient();
        $client->request('DELETE', sprintf('/interventions/%s', $intervention->id));

        self::assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }
}
