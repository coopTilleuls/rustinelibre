<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Filters;

use App\Tests\AbstractTestCase;

class AroundFilterTest extends AbstractTestCase
{
    public function testAroundFilter5Km(): void
    {
        $response = static::createClient()->request('GET', '/repairers?around[5000]=50.621917,3.063398');
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertEquals(3, $response->toArray()['hydra:totalItems']);
    }

    public function testAroundFilter1km(): void
    {
        $response = static::createClient()->request('GET', '/repairers?around[1000]=50.621917,3.063398');
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertEquals(2, $response->toArray()['hydra:totalItems']);
    }

    public function testAroundFilter50meters(): void
    {
        $response = static::createClient()->request('GET', '/repairers?around[50]=50.621917,3.063398');
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertEquals(1, $response->toArray()['hydra:totalItems']);
    }
}
