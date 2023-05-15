<?php

declare(strict_types=1);

namespace App\Tests\RepairerOpeningHours\Security;

use App\Entity\RepairerOpeningHours;
use App\Repository\RepairerOpeningHoursRepository;
use App\Tests\AbstractTestCase;

class DeleteTest extends AbstractTestCase
{
    private RepairerOpeningHoursRepository $repairerOpeningHoursRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerOpeningHoursRepository = self::getContainer()->get(RepairerOpeningHoursRepository::class);
    }

    public function testAdminCanDeleteRepairerOpeningHours(): void
    {
        $roh = $this->repairerOpeningHoursRepository->findOneBy([]);
        $this->createClientAuthAsAdmin()->request('DELETE', sprintf('/repairer_opening_hours/%d', $roh->id));

        self::assertResponseStatusCodeSame(204);
    }

    public function testOwnerCanDeleteHisRepairerOpeningHours(): void
    {
        /** @var RepairerOpeningHours $roh */
        $roh = $this->repairerOpeningHoursRepository->findOneBy([]);
        $this->createClientWithUser($roh->repairer->owner)->request('DELETE', sprintf('/repairer_opening_hours/%d', $roh->id));

        self::assertResponseStatusCodeSame(204);
    }

    public function testBossCannotDeleteOtherRepairerOpeningHours(): void
    {
        /** @var RepairerOpeningHours $roh */
        $roh = $this->repairerOpeningHoursRepository->findOneBy([]);
        $this->createClientAuthAsBoss()->request('DELETE', sprintf('/repairer_opening_hours/%d', $roh->id));

        self::assertResponseStatusCodeSame(403);
    }
}
