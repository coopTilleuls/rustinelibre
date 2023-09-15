<?php

declare(strict_types=1);

namespace App\Tests\RepairerIntervention;

use App\Repository\RepairerRepository;
use App\Tests\Intervention\InterventionAbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class CreateRepairerInterventionTest extends InterventionAbstractTestCase
{
    private RepairerRepository $repairerRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
    }

    public function testBossCanLinkRepairerToAdminIntervention(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $id = $this->getAdminIntervention()->id;
        $client = $this->createClientWithUser($repairer->owner);
        $response = $client->request('POST', '/repairer_interventions', [
            'json' => [
                'intervention' => sprintf('/interventions/%s', $id),
                'price' => 100,
            ],
        ]);

        self::assertResponseIsSuccessful();
        self::assertArrayHasKey('repairer', $response->toArray());
        self::assertJsonContains([
            'intervention' => sprintf('/interventions/%s', $id),
            'price' => 100,
        ]);
    }

    public function testBossCannotLinkToOtherBossIntervention(): void
    {
        [$badBoss, $intervention] = $this->getBossAndOtherBossIntervention();
        $client = $this->createClientWithUser($badBoss);
        $client->request('POST', '/repairer_interventions', [
            'json' => [
                'intervention' => sprintf('/interventions/%s', $intervention->id),
                'price' => 100,
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
