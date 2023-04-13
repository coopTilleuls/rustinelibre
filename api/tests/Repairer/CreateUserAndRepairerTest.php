<?php

namespace App\Tests\Repairer;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class CreateUserAndRepairerTest extends AbstractTestCase
{
    private array $jsonNewRepairerAndUser = [
        'firstName' => 'Michel',
        'lastName' => 'Michel',
        'email' => 'michel@michel.com',
        'plainPassword' => 'test',
        'name' => 'Nouvel atelier',
        'street' => '8 rue de la justice',
        'city' => 'Lille',
        'postcode' => '59000',
        'bikeTypesSupported' => ['/bike_types/1', '/bike_types/2'],
        'repairerType' => '/repairer_types/1',
        'comment' => 'Bonjour je voudrais rejoindre votre super plateforme',
    ];

    public function testPostRepairerAndUserMissingFields(): void
    {
        $jsonMissingFields = $this->jsonNewRepairerAndUser;
        unset($jsonMissingFields['city']);
        unset($jsonMissingFields['email']);

        // No need auth
        $response = $this->createClient()->request('POST', '/create_user_and_repairer', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => $jsonMissingFields,
        ]);
        $this->assertResponseStatusCodeSame(422);
    }

    public function testPostRepairerAndUser(): void
    {
        // No need auth
        $response = $this->createClient()->request('POST', '/create_user_and_repairer', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => $this->jsonNewRepairerAndUser,
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);

        $responseData = $response->toArray();

        $newRepairerIri = $responseData['@id'];
        $newOwnerIri = $responseData['owner'];

        $this->assertArrayHasKey('owner', $responseData);
        $this->assertNotNull($responseData['owner']);
        $this->assertEquals('Lille', $responseData['city']);
        $this->assertEquals('59000', $responseData['postcode']);

        // Remove creations for futures tests
        $this->createClientAuthAsAdmin()->request('DELETE', $newRepairerIri);
        $this->createClientAuthAsAdmin()->request('DELETE', $newOwnerIri);
    }
}
