<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Filters;

use App\Tests\AbstractTestCase;

class AroundFilterTest extends AbstractTestCase
{
    public function testAroundFilter5Km(): void
    {
        $response = static::createClient()->request('GET', '/repairers?around[lille]=50.621917,3.063398');
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertEquals(22, $response->toArray()['hydra:totalItems']);
    }

    public function testCityLommeAroundFilter5Km(): void
    {
        $response = static::createClient()->request('GET', '/repairers?around[lomme]=50.643554,2.988918');
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertEquals(2, $response->toArray()['hydra:totalItems']);
    }

    public function testCityHellemesAroundFilter5Km(): void
    {
        $response = static::createClient()->request('GET', '/repairers?around[hellemes]=50.626699,3.111498');
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertEquals(10, $response->toArray()['hydra:totalItems']);
    }
}
