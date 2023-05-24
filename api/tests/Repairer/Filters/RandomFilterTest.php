<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Filters;

use App\Tests\AbstractTestCase;

class RandomFilterTest extends AbstractTestCase
{
    public function testRandomFilter(): void
    {
        $responses = [];

        // Check if the first id is not the same at each request
        for ($i = 0; $i < 3; ++$i) {
            $response = static::createClient()->request('GET', '/repairers?sort=random')->toArray();
            self::assertResponseIsSuccessful();
            $responses[] = $response['hydra:member'][0]['@id'];
        }

        $this->assertGreaterThan(1, count(array_unique($responses)));
    }

    public function testRandomFilterWorkWithFirstSlotAvailableFilter(): void
    {
        $firstResponse = static::createClient()->request('GET', '/repairers?sort=random&availability=ASC')->toArray()['hydra:member'];
        self::assertResponseIsSuccessful();
        $secondResponse = static::createClient()->request('GET', '/repairers?sort=random&availability=ASC')->toArray()['hydra:member'];
        self::assertResponseIsSuccessful();

        $idsFromFirstResponse = [];
        $idsFromSecondResponse = [];

        foreach ($firstResponse as $key => $repairer) {
            // Check that each result has a firstSlotAvailable less or equal to next result
            if (array_key_exists($key + 1, $firstResponse)) {
                $this->assertLessThanOrEqual($firstResponse[$key + 1]['firstSlotAvailable'], $repairer['firstSlotAvailable']);
            }
            $idsFromFirstResponse[$repairer['firstSlotAvailable']][] = $repairer['@id'];
        }

        foreach ($secondResponse as $key => $repairer) {
            // Check that each result has a firstSlotAvailable less or equal to next result
            if (array_key_exists($key + 1, $secondResponse)) {
                $this->assertLessThanOrEqual($secondResponse[$key + 1]['firstSlotAvailable'], $repairer['firstSlotAvailable']);
            }
            $idsFromSecondResponse[$repairer['firstSlotAvailable']][] = $repairer['@id'];
        }

        foreach ($idsFromFirstResponse as $key => $ids) {
            if (count($ids) > 1) {
                // if there are several results with the same firstSlotAvailable, their order should change between requests
                $this->assertNotSame($ids, $idsFromSecondResponse[$key]);
            } elseif (1 === count($ids)) {
                $this->assertSame($ids, $idsFromSecondResponse[$key]);
            }
        }
    }

    public function testRandomFilterWorkWithSearchFilter(): void
    {
        $firstResponse = static::createClient()->request('GET', '/repairers?sort=random&repairerType.name=Réparateur%20à%20vélo')->toArray()['hydra:member'];
        self::assertResponseIsSuccessful();
        $secondResponse = static::createClient()->request('GET', '/repairers?sort=random&repairerType.name=Réparateur%20à%20vélo')->toArray()['hydra:member'];
        self::assertResponseIsSuccessful();

        $idsFromFirstResponse = [];
        $idsFromSecondResponse = [];

        foreach ($firstResponse as $repairer) {
            $idsFromFirstResponse[] = $repairer['@id'];
        }

        foreach ($secondResponse as $repairer) {
            $idsFromSecondResponse[] = $repairer['@id'];
        }

        $this->assertNotSame($idsFromFirstResponse, $idsFromSecondResponse);

        // Check repairer type
        $firstRepairer = static::createClient()->request('GET', $idsFromFirstResponse[0])->toArray();
        $this->assertEquals('Réparateur itinérant', $firstRepairer['repairerType']['name']);

        $secondRepairer = static::createClient()->request('GET', $idsFromSecondResponse[0])->toArray();
        $this->assertEquals('Réparateur itinérant', $secondRepairer['repairerType']['name']);
    }

    public function testRandomFilterWorkWithAroundFilter(): void
    {
        $responses = [];
        for ($i = 0; $i < 10; ++$i) {
            $response = static::createClient()->request('GET', '/repairers?sort=random&around[10]=50.67394149851168,3.0665240417922486')->toArray()['hydra:member'];
            if (count($response) < 2) {
                $this->markTestSkipped('He should have at least 2 repairers with same latitude and longitude to test the random filter with the around filter.');
            }
            self::assertResponseIsSuccessful();
            $responses[] = $response[0]['@id'];
        }

        // check if the first id is not the same at each request
        $this->assertGreaterThan(1, count(array_unique($responses)));
    }
}
