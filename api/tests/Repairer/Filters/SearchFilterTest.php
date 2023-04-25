<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Filters;

use App\Tests\AbstractTestCase;

class SearchFilterTest extends AbstractTestCase
{
    public function testSearchFilter(): void
    {
        $response = static::createClient()->request('GET', '/repairers?repairerType.name=atelier');
        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $responseData = $response->toArray();
        $this->assertEquals(15, $responseData['hydra:totalItems']);

        // test if first and second repairers have the "atelier" repairer bike type
        $firstRepairer = static::createClient()->request('GET', $responseData['hydra:member'][0]['@id'])->toArray();
        $secondRepairer = static::createClient()->request('GET', $responseData['hydra:member'][1]['@id'])->toArray();

        $this->assertStringContainsString('atelier', strtolower($firstRepairer['repairerType']['name']));
        $this->assertStringContainsString('atelier', strtolower($secondRepairer['repairerType']['name']));
    }
}
