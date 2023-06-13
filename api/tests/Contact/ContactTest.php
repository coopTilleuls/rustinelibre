<?php

declare(strict_types=1);

namespace App\Tests\Contact;

use App\Repository\ContactRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class ContactTest extends AbstractTestCase
{
    public function testPostContact(): void
    {
        $this->createClient()->request('POST', '/contacts', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'firstName' => 'Michel',
                'lastName' => 'Michel',
                'email' => 'michel@mail.com',
                'content' => 'Bonjour, super sympa votre site !',
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
    }

    public function testGetContactCollection(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', '/contacts');
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testGetContact(): void
    {
        $contact = static::getContainer()->get(ContactRepository::class)->findOneBy([]);
        $this->createClientAuthAsAdmin()->request('GET', sprintf('/contacts/%s', $contact->id));
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
    }

    public function testGetContactAsUser(): void
    {
        $contact = static::getContainer()->get(ContactRepository::class)->findOneBy([]);
        $this->createClientAuthAsUser()->request('GET', sprintf('/contacts/%s', $contact->id));
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }

    public function testGetContactCollectionAsUser(): void
    {
        $this->createClientAuthAsUser()->request('GET', '/contacts');
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
