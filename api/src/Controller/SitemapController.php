<?php

declare(strict_types=1);

namespace App\Controller;

use App\Repository\RepairerRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SitemapController extends AbstractController
{
    public function __construct(
        private readonly RepairerRepository $repairerRepository,
    ) {
    }

    #[Route(path: '/sitemap.xml', name: 'sitemap', defaults: ['_format' => 'xml'], methods: ['GET'])]
    public function index(): Response
    {
        $urls = array_merge(
            $this->getStaticUrls(),
            $this->buildUrlsWithRepairerId(['/reparateur/%d', '/reparateur/%d/creneaux']),
        );

        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml');

        return $this->render('sitemap/sitemap.xml.twig', [
            'urls' => $urls,
            'hostname' => $_ENV['WEB_APP_URL'],
        ], $response);
    }

    /**
     * @param array<string> $endpoints
     *
     * @return array<string>
     */
    private function buildUrlsWithRepairerId(array $endpoints): array
    {
        $result = [];
        $ids = $this->repairerRepository->getAllIds();

        foreach ($endpoints as $endpoint) {
            foreach ($ids as $id) {
                $result[] = sprintf($endpoint, $id);
            }
        }

        return $result;
    }

    /**
     * @return array<string>
     */
    private function getStaticUrls(): array
    {
        return [
            '/admin/contact',
            '/admin/parametres',
            '/admin/parametres/interventions/ajouter',
            '/admin/parametres/type-de-reparateur/ajouter',
            '/admin/parametres/type-de-velo/ajouter',
            '/admin/reparateurs',
            '/admin/utilisateurs',
            '/admin/modifier-mot-de-passe',
            '/admin/profil',

            '/carnet/creer-mon-carnet',

            '/messagerie',

            '/profil/modifier-mot-de-passe',
            '/profil/mon-profil',

            '/rendez-vous/mes-rendez-vous',

            '/reparateur/chercher-un-reparateur',
            '/reparateur/inscription',
            '/reparateur/rejoindre-le-collectif',

            '/sradmin/agenda',
            '/sradmin/agenda/parametres',
            '/sradmin/clients',
            '/sradmin/employes',
            '/sradmin/employes/ajouter',
            '/sradmin',
            '/sradmin/informations',
            '/sradmin/messagerie',

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
