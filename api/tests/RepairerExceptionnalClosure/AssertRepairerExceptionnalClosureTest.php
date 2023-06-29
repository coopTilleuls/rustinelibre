<?php

declare(strict_types=1);

namespace App\Tests\RepairerExceptionnalClosure;

use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;

class AssertRepairerExceptionnalClosureTest extends AbstractTestCase
{
    private RepairerRepository $repairerRepository;

    private TranslatorInterface $translator;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
        $this->translator = static::getContainer()->get(TranslatorInterface::class);
    }

    public function testCreateWithEndDateBeforeStartDate(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_exceptional_closures',
            [
                'json' => [
                    'repairer' => sprintf('/repairers/%d', $repairer->id),
                    'startDate' => (new \DateTime('+1 day'))->format('Y-m-d'),
                    'endDate' => (new \DateTime('-1 day'))->format('Y-m-d'),
                ],
            ]
        );

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertStringContainsString($this->translator->trans('repairer.closing.valid_date', domain: 'validators'), $response->getContent(false));
    }
}
