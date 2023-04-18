<?php

declare(strict_types=1);

namespace App\Tests\Intervention;

use App\Entity\RepairerIntervention;
use App\Entity\User;

class GetInterventionTest extends InterventionAbstractTestCase
{
    public function testGetCollectionInterventionFromBoss(): void
    {
        $user = $this->getBossAndHisIntervention()[0];

        // get all interventions from user
        $expectedInterventions = array_map(static function (RepairerIntervention $repairerIntervention) {
            return $repairerIntervention->intervention->id;
        }, $user->repairer->getRepairerInterventions()->toArray());

        $client = $this->createClientAuthAsBoss();
        $response = $client->request('GET', sprintf('/interventions?owner=%s', $user->id))->toArray();

        self::assertResponseIsSuccessful();
        foreach ($response['hydra:member'] as $intervention) {
            self::assertArrayHasKey('id', $intervention);
            // check if retrieved intervention is in user interventions
            self::assertContains($intervention['id'], $expectedInterventions);
        }
    }

    public function testCanGetCollectionAdminInterventions(): void
    {
        $client = self::createClient();
        $response = $client->request('GET', '/interventions?isAdmin=true')->toArray();

        self::assertResponseIsSuccessful();
        self::assertGreaterThan(1, $response['hydra:totalItems']);
        foreach ($response['hydra:member'] as $intervention) {
            self::assertArrayHasKey('id', $intervention);
            self::assertArrayHasKey('description', $intervention);
            self::assertArrayHasKey('isAdmin', $intervention);
            self::assertEquals(true, $intervention['isAdmin']);
        }
    }

    public function testCanGetIntervention(): void
    {
        $id = $this->getAdminIntervention()->id;
        $client = self::createClient();
        $response = $client->request('GET', sprintf('/interventions/%d', $id))->toArray();
        self::assertResponseIsSuccessful();
        self::assertArrayHasKey('id', $response);
        self::assertSame($id, $response['id']);
    }
}
