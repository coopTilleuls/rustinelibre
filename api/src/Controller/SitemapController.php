<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\RepairerRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\Routing\Annotation\Route;
use Twig\Environment;

#[AsController]
class SitemapController
{
    public function __construct(
        private readonly RepairerRepository $repairerRepository,
        private readonly Environment $twig,
    ) {
    }

    #[Route(path: '/sitemap.xml', name: 'sitemap', defaults: ['_format' => 'xml'], methods: ['GET'])]
    public function index(): Response
    {
        $urls = array_merge(
            $this->getStaticUrls(),
            $this->buildUrlsRepairersWithIdAndSlug(),
            $this->buildUrlsOfSlots()
        );

        $response = new Response($this->twig->render('sitemap/sitemap.xml.twig', [
            'urls' => $urls,
            'hostname' => $_ENV['WEB_APP_URL'],
        ]));

        $response->headers->set('Content-Type', 'text/xml');

        return $response;
    }

    /**
     * @return array<string>
     */
    private function buildUrlsRepairersWithIdAndSlug(): array
    {
        $result = [];
        $ids = $this->repairerRepository->getAllIdsAndSlugs();

        foreach ($ids as $id) {
            $result[] = sprintf('/reparateur/%d-%s', $id['id'], $id['slug']);
        }

        return $result;
    }

    /**
     * @return array<string>
     */
    private function buildUrlsOfSlots(): array
    {
        $result = [];
        $ids = $this->repairerRepository->getAllIdsAndSlugs();

        foreach ($ids as $id) {
            $result[] = sprintf('/reparateur/%d/creneaux', $id['id']);
        }

        return $result;
    }

    /**
     * @return array<string>
     */
    private function getStaticUrls(): array
    {
        return [
            '/carnet/creer-mon-carnet',

            '/messagerie',

            '/profil/modifier-mot-de-passe',
            '/profil/mon-profil',

            '/rendez-vous/mes-rendez-vous',

            '/reparateur/chercher-un-reparateur',
            '/reparateur/inscription',
            '/reparateur/rejoindre-le-collectif',

            '/velos/mes-velos',

            '/',
            '/faq',
            '/inscription',
            '/liste-des-reparateurs',
            '/login',
            '/mentions-legales',
            '/notre-collectif',
        ];
    }
}
