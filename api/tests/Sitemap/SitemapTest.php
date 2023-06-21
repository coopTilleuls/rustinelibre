<?php

declare(strict_types=1);

namespace App\Tests\Sitemap;

use App\Tests\AbstractTestCase;

class SitemapTest extends AbstractTestCase
{
    public function testAllUrlsAreValid(): void
    {
        self::createClient()->request('GET', '/sitemap.xml');
        self::assertResponseIsSuccessful();
        self::assertResponseHeaderSame('content-type', 'text/xml; charset=UTF-8');
    }
}
