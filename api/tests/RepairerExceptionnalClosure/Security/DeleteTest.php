<?php

declare(strict_types=1);

namespace App\Tests\RepairerExceptionnalClosure\Security;

use App\Entity\RepairerExceptionalClosure;
use App\Repository\RepairerExceptionalClosureRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class DeleteTest extends AbstractTestCase
{
    private RepairerExceptionalClosureRepository $repairerExceptionalClosureRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerExceptionalClosureRepository = self::getContainer()->get(RepairerExceptionalClosureRepository::class);
    }

    public function testAdminCanDeleteRepairerExceptionalClosure(): void
    {
        /** @var RepairerExceptionalClosure $rec */
        $rec = $this->repairerExceptionalClosureRepository->findOneBy([]);
        $this->createClientAuthAsAdmin()->request('DELETE', sprintf('/repairer_exceptional_closures/%d', $rec->id));

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testBossCanDeleteHisRepairerExceptionalClosure(): void
    {
        /** @var RepairerExceptionalClosure $rec */
        $rec = $this->repairerExceptionalClosureRepository->findOneBy([]);
        $this->createClientWithUser($rec->repairer->owner)->request('DELETE', sprintf('/repairer_exceptional_closures/%d', $rec->id));

        self::assertResponseStatusCodeSame(Response::HTTP_NO_CONTENT);
    }

    public function testBossCannotDeleteOtherRepairerExceptionalClosure(): void
    {
        /** @var RepairerExceptionalClosure $rec */
        $rec = $this->repairerExceptionalClosureRepository->findOneBy([]);
        $this->createClientAuthAsUser()->request('DELETE', sprintf('/repairer_exceptional_closures/%d', $rec->id));

        self::assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
