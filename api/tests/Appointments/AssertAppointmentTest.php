<?php

declare(strict_types=1);

namespace App\Tests\Appointments;

use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class AssertAppointmentTest extends AbstractTestCase
{
    private readonly RepairerRepository $repairerRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairerRepository = self::getContainer()->get(RepairerRepository::class);
    }

    public function testCreateAppointmentWithoutRepairer(): void
    {
        $this->createClientAuthAsUser()->request('POST', '/appointments', [
            'json' => [
                'slotTime' => (new \DateTimeImmutable('+1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'repairer: This value should not be null.
repairer: This value should not be blank.',
        ]);
    }

    public function testCreateAppointmentWithoutSlotTime(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $this->createClientAuthAsUser()->request('POST', '/appointments', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'slotTime: This value should not be null.
slotTime: This value should not be blank.',
        ]);
    }

    public function testCreateAppointmentWithOldSlotTime(): void
    {
        $repairer = $this->repairerRepository->findOneBy([]);
        $response = $this->createClientAuthAsUser()->request('POST', '/appointments', [
            'json' => [
                'repairer' => sprintf('/repairers/%d', $repairer->id),
                'slotTime' => (new \DateTimeImmutable('-1 day'))->format('Y-m-d H:i:s'),
            ],
        ]);

        self::assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertStringContainsString('slotTime: This value should be greater than', $response->getContent(false));
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
        ]);
    }
}
