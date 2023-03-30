<?php

declare(strict_types=1);

namespace App\Tests\Repairer\SlotsAvailable;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class FirstSlotAvailableTest extends AbstractTestCase
{
    public function testGetOrderBySlotAvailable(): void
    {
        // Check order of results
        $response = static::createClient()->request('GET', '/repairers?order[firstSlotAvailable]=ASC');
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $responseData = $response->toArray();
        // Check that first result is less than second and second less than third
        $this->assertEquals(3, $responseData['hydra:member'][0]['id']);
        $this->assertLessThan($responseData['hydra:member'][1]['firstSlotAvailable'], $responseData['hydra:member'][0]['firstSlotAvailable']);
        $this->assertLessThan($responseData['hydra:member'][2]['firstSlotAvailable'], $responseData['hydra:member'][1]['firstSlotAvailable']);

        // Create an appointment
        $this->createClientAuthAsAdmin()->request('POST', '/appointments', ['json' => [
            'customer' => '/users/1',
            'repairer' => '/repairers/'.$responseData['hydra:member'][0]['id'],
            'slotTime' => '2023-03-22T11:00:00+00:00',
        ]]);
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        // Check that previous first result is no more before others
        $response = static::createClient()->request('GET', '/repairers?order[firstSlotAvailable]=ASC');
        $responseData = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertNotEquals(3, $responseData['hydra:member'][0]['id']);
        $this->assertLessThanOrEqual($responseData['hydra:member'][1]['firstSlotAvailable'], $responseData['hydra:member'][0]['firstSlotAvailable']);
        $this->assertLessThanOrEqual($responseData['hydra:member'][2]['firstSlotAvailable'], $responseData['hydra:member'][1]['firstSlotAvailable']);
    }

    public function testNewRepairerShouldHaveFirstSlotValue(): void
    {
        // Create a repairer
        $response = $this->createClientAuthAsAdmin()->request('POST', '/repairers', ['json' => [
            'owner' => '/users/13',
            'description' => 'Nouvel atelier de réparation',
            'mobilePhone' => '0720397799',
            'street' => 'avenue Nino Marchese',
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $responseData = $response->toArray();
        $this->assertNotNull($responseData['firstSlotAvailable']);

        $response2 = $this->createClientAuthAsAdmin()->request('PUT', '/repairers/'.$responseData['id'], ['json' => [
            'rrule' => 'FREQ=MINUTELY;INTERVAL=90;BYHOUR=18,19;BYDAY=WE,TH,FR',
        ]]);
        $responseDataUpdate = $response2->toArray();

        $this->assertNotEquals($responseData['firstSlotAvailable'], $responseDataUpdate['firstSlotAvailable']);
    }
}
