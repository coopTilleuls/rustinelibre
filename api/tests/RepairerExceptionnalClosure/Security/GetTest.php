<?php

declare(strict_types=1);

namespace App\Tests\RepairerExceptionnalClosure\Security;

use App\Entity\RepairerExceptionalClosure;
use App\Repository\RepairerExceptionalClosureRepository;
use App\Tests\AbstractTestCase;

class GetTest extends AbstractTestCase
{
    private RepairerExceptionalClosureRepository $repairerExceptionalClosureRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerExceptionalClosureRepository = self::getContainer()->get(RepairerExceptionalClosureRepository::class);
    }

    public function testOwnerGetOnlyHisRepairerExceptionalClosure(): void
    {
        /** @var RepairerExceptionalClosure $rec */
        $rec = $this->repairerExceptionalClosureRepository->findOneBy([]);
        $response = $this->createClientWithUser($rec->repairer->owner)->request('GET', '/repairer_exceptional_closures')->toArray();

        self::assertResponseIsSuccessful();
        foreach ($response['hydra:member'] as $iteration) {
            $id = $this->repairerExceptionalClosureRepository->findOneBy(['id' => $iteration['id']])->repairer->owner->id;
            self::assertEquals($rec->repairer->owner->id, $id);
        }
    }
}
