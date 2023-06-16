<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class SitemapController extends AbstractController
{
    #[Route(path: '/sitemap.xml', name: 'sitemap', defaults: ['_format' => 'xml'], methods: ['GET'])]
    public function index(): Response
    {
        $urls = [];
        // @todo ajouter les routes dynamiques et statiques dans $urls

        $response = new Response();
        $response->headers->set('Content-Type', 'text/xml');

        return $this->render('sitemap/sitemap.xml.twig', [
            'urls' => $urls,
            'hostname' => 'https://localhost', // @todo à mettre le bon param (le récup de .env ?)
        ], $response);
    }
}
