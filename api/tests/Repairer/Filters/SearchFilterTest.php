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
        $this->assertStringContainsString('atelier', strtolower($responseData['hydra:member'][0]['repairerType']['name']));
        $this->assertStringContainsString('atelier', strtolower($responseData['hydra:member'][1]['repairerType']['name']));
    }
}
