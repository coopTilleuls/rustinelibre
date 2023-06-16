<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use App\Sitemap\StateProvider\SitemapProvider;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    normalizationContext: ['groups' => [self::SITEMAP_READ]]
)]
#[GetCollection(
    provider: SitemapProvider::class
)]
class Sitemap
{
    protected const SITEMAP_READ = 'sitemap_read';

    public function __construct(
        #[Groups([self::SITEMAP_READ])]
        public string $loc,
    ) {}
}
