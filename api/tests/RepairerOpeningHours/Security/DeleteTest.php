<?php

declare(strict_types=1);

namespace App\Tests\RepairerOpeningHours\Security;

use App\Entity\RepairerOpeningHours;
use App\Repository\RepairerOpeningHoursRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

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

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testOwnerCanDeleteHisRepairerOpeningHours(): void
    {
        /** @var RepairerOpeningHours $roh */
        $roh = $this->repairerOpeningHoursRepository->findOneBy([]);
        $this->createClientWithUser($roh->repairer->owner)->request('DELETE', sprintf('/repairer_opening_hours/%d', $roh->id));

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testBossCannotDeleteOtherRepairerOpeningHours(): void
    {
        /** @var RepairerOpeningHours $roh */
        $roh = $this->repairerOpeningHoursRepository->findOneBy([]);

        $this->createClientWithCredentials([
            'email' => 'boss2@test.com',
            'password' => 'Test1passwordOk!'
        ])->request('DELETE', sprintf('/repairer_opening_hours/%d', $roh->id));

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
