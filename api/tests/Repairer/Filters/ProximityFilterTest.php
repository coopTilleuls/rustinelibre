<?php

namespace App\Tests\Repairer\Filters;

use App\Tests\AbstractTestCase;

class ProximityFilterTest extends AbstractTestCase
{
    public function testGetRepairerProximity(): void
    {
        $response = static::createClient()->request('GET', '/repairers?proximity=50.623932,3.057561');
        $this->assertResponseIsSuccessful();
        $responseData = $response->toArray();

        // Get the third result infos
        $thirdLat = $responseData['hydra:member'][2]['latitude'];
        $thirdLon = $responseData['hydra:member'][2]['longitude'];
        $thirdName = $responseData['hydra:member'][2]['name'];

        // The third farthest became the closer with his own latitude and longitude in parameters
        $newResponse = static::createClient()->request('GET', sprintf('/repairers?proximity=%s,%s', $thirdLat, $thirdLon));
        $this->assertResponseIsSuccessful();
        $newResponseData = $newResponse->toArray();
        $this->assertEquals($thirdName, $newResponseData['hydra:member'][0]['name']);
    }
}
