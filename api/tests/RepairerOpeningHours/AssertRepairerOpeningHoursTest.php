<?php

declare(strict_types=1);

namespace App\Tests\RepairerOpeningHours;

use App\Repository\RepairerOpeningHoursRepository;
use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;
use App\Tests\Trait\RepairerTrait;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;

class AssertRepairerOpeningHoursTest extends AbstractTestCase
{
    use RepairerTrait;

    private RepairerOpeningHoursRepository $repairerOpeningHoursRepository;

    private TranslatorInterface $translator;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
        $this->repairerOpeningHoursRepository = self::getContainer()->get(RepairerOpeningHoursRepository::class);
        $this->translator = static::getContainer()->get(TranslatorInterface::class);
    }

    public function testCreateWithBadFormattedStartTime(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '10:18',
                'endTime' => '18:00',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertStringContainsString($this->translator->trans('repairer.openingHours.format', domain: 'validators'), $response->getContent(false));
    }

    public function testCreateWithBadFormattedEndTime(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '10:00',
                'endTime' => '18:18',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertStringContainsString($this->translator->trans('repairer.openingHours.format', domain: 'validators'), $response->getContent(false));
    }

    public function testCreateWithStartTimeGreatherThanEndTime(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '10:00',
                'endTime' => '09:00',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertStringContainsString($this->translator->trans('repairer.opening.valid_time', domain: 'validators'), $response->getContent(false));
    }

    public function testCreateWithBadDay(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'mondayy',
                'startTime' => '10:00',
                'endTime' => '18:00',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertStringContainsString($this->translator->trans('repairer.opening.valid_days', domain: 'validators'), $response->getContent(false));
    }

    public function testCreateWithOverlappedHours(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $rohs = $this->repairerOpeningHoursRepository->findBy(['repairer' => $repairer->id]);

        // reset repairer opening hours
        foreach ($rohs as $roh) {
            $this->repairerOpeningHoursRepository->remove($roh);
        }

        $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '18:00',
                'endTime' => '19:00',
            ],
        ]);

        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '18:30',
                'endTime' => '19:00',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertStringContainsString($this->translator->trans('repairer.opening.overlapped', domain: 'validators'), $response->getContent(false));
    }

    public function testCreateWithNotOverlappedHours(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $rohs = $this->repairerOpeningHoursRepository->findBy(['repairer' => $repairer->id]);

        // reset repairer opening hours
        foreach ($rohs as $roh) {
            $this->repairerOpeningHoursRepository->remove($roh);
        }

        $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '18:00',
                'endTime' => '19:00',
            ],
        ]);

        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairer_opening_hours', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'day' => 'monday',
                'startTime' => '19:00',
                'endTime' => '20:00',
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_CREATED);
    }
}
