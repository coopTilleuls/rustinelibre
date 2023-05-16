<?php

declare(strict_types=1);

namespace App\Tests\RepairerOpeningHours\Security;

use App\Entity\RepairerOpeningHours;
use App\Repository\RepairerOpeningHoursRepository;
use App\Tests\AbstractTestCase;

class GetTest extends AbstractTestCase
{
    private RepairerOpeningHoursRepository $rohRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->rohRepository = self::getContainer()->get(RepairerOpeningHoursRepository::class);
    }

    public function testRepairerGetOnlyHisRepairerOpeningHours(): void
    {
        /** @var RepairerOpeningHours $roh */
        $roh = $this->rohRepository->findOneBy([]);
        $response = $this->createClientWithUser($roh->repairer->owner)->request('GET', '/repairer_opening_hours')->toArray();

        self::assertResponseIsSuccessful();
        foreach ($response['hydra:member'] as $iteration) {
            $id = $this->rohRepository->findOneBy(['id' => $iteration['id']])->repairer->owner->id;
            self::assertEquals($roh->repairer->owner->id, $id);
        }
    }
}
