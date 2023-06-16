<?php

declare(strict_types=1);

namespace App\Sitemap\StateProvider;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Sitemap;

class SitemapProvider implements ProviderInterface
{

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        dd('test');
        return [new Sitemap('https://example.com')];
    }
}