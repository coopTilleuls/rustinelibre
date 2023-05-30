<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Filters;

use App\Repository\UserRepository;
use App\Tests\Repairer\Slots\SlotsTestCase;
use Symfony\Component\HttpFoundation\Response;

class FirstSlotAvailableFilterTest extends SlotsTestCase
{
    public function setUp(): void
    {
        parent::setUp();
        $this->updateOldFirstSlotAvailableService->updateOldFirstSlotAvailable();
    }

    public function testGetOrderBySlotAvailable(): void
    {
        $user = $this->getObjectByClassNameAndValues(UserRepository::class, ['email' => 'user1@test.com']);

        $response = static::createClient()->request('GET', '/repairers?availability=ASC')->toArray();
        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Check that first result is less than second and second less than third
        self::assertLessThanOrEqual($response['hydra:member'][1]['firstSlotAvailable'], $response['hydra:member'][0]['firstSlotAvailable']);
        self::assertLessThanOrEqual($response['hydra:member'][2]['firstSlotAvailable'], $response['hydra:member'][1]['firstSlotAvailable']);

        // Create an appointment
        $this->createClientAuthAsAdmin()->request('POST', '/appointments', ['json' => [
            'customer' => sprintf('/users/%s', $user->id),
            'repairer' => sprintf('/repairers/%d', $response['hydra:member'][0]['id']),
            'slotTime' => \DateTimeImmutable::createFromFormat('Y-m-d\TH:i:sP', $response['hydra:member'][0]['firstSlotAvailable'])->format('Y-m-d H:i:s'),
        ]]);
        self::assertResponseStatusCodeSame(Response::HTTP_CREATED);

        // Check that previous first result is no more before others
        $response2 = static::createClient()->request('GET', '/repairers?availability=ASC')->toArray();
        self::assertResponseIsSuccessful();
        self::assertNotEquals($response['hydra:member'][0], $response2['hydra:member'][0]);
        self::assertLessThanOrEqual($response2['hydra:member'][1]['firstSlotAvailable'], $response2['hydra:member'][0]['firstSlotAvailable']);
        self::assertLessThanOrEqual($response2['hydra:member'][2]['firstSlotAvailable'], $response2['hydra:member'][1]['firstSlotAvailable']);
    }
}
