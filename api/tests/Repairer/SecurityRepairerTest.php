<?php

namespace App\Tests\Repairer;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityRepairerTest extends AbstractTestCase
{
    public function testPostRepairer(): void
    {
        $client = self::createClientWithUserId(50);

        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Chez Jojo',
                'description' => 'On aime réparer des trucs',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la clé',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/1', '/bike_types/2'],
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
    }

    public function testDeleteRepairer(): void
    {
        $client = self::createClientAuthAsAdmin();
        $client->request('DELETE', 'repairers/26');
        $this->assertResponseIsSuccessful();
    }

    public function testPostRepairerFail(): void
    {
        // unauthenticated client
        self::createClient()->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Chez Jojo',
                'description' => 'On aime réparer des trucs',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la clé',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/1'],
                'latitude' => '50.6365654',
                'longitude' => '3.0635282',
            ],
        ]);
        $this->assertResponseStatusCodeSame(401);
    }

    public function testGetRepairerByUser(): void
    {
        $client = self::createClientAuthAsUser();
        // classic user given
        $response = $client->request('GET', '/repairers/4');
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertSame($response['name'], 'Au réparateur de bicyclettes');
        $this->assertSame($response['owner'], '/users/24');
        $this->assertSame($response['bikeTypesSupported'][0]['@id'], '/bike_types/2');
        $this->assertSame($response['bikeTypesSupported'][1]['@id'], '/bike_types/1');
        $this->assertSame($response['repairerType']['@id'], '/repairer_types/1');
        $this->assertSame($response['openingHours'], 'Du lundi au vendredi : 9h-12h / 14h-19h');
        $this->assertSame($response['optionalPage'], 'Nous fonctionnons uniquement sur rendez-vous');
        $this->assertArrayNotHasKey('enabled', $response);
    }

    public function testGetRepairerByAdmin(): void
    {
        $client = self::createClientAuthAsAdmin();
        // admin user given
        $response = $client->request('GET', '/repairers/4');
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertSame($response['name'], 'Au réparateur de bicyclettes');
        $this->assertArrayHasKey('enabled', $response);
    }

    public function testGetRepairerCollectionByAdmin(): void
    {
        $client = self::createClientAuthAsAdmin();
        // admin user given
        $response = $client->request('GET', '/repairers');
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        // should have a minimum of 25 results as provided by fixtures
        $this->assertTrue(25 <= count($response['hydra:member']));
    }

    public function testGetRepairerCollectionFilterByEnabled(): void
    {
        $client = self::createClientAuthAsAdmin();
        // admin user given
        $response = $client->request('GET', '/repairers?enabled=true');
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        // On 25 repairers -> 3 aren't enabled
        $this->assertCount(22, $response['hydra:member']);
    }

    public function testUniqueOwner(): void
    {
        $client = self::createClientWithUserId(26);
        // Valid user role given but already have a repairer
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Deuxième atelier du même boss',
            ],
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function testOwnerCreatedByUser(): void
    {
        $client = self::createClientWithUserId(16);
        // simple user given
        $response = $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Test create by user',
                'description' => 'Test create by user',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/2'],
                'comment' => 'Je voulais juste ajouter un commentaire',
            ],
        ]);
        $response = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertSame($response['owner'], '/users/16');
        $this->assertSame($response['comment'], 'Je voulais juste ajouter un commentaire');
    }

    public function testOwnerSecurity(): void
    {
        $client = self::createClientWithUserId(15);
        // simple user given who try to assigne other owner
        $response = $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Test owner security',
                'description' => 'Test owner security',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la clé',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/1'],
            ],
        ]);
        $response = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertSame($response['owner'], '/users/15');
    }

    public function testPutEnabledByAdmin(): void
    {
        $client = self::createClientAuthAsAdmin();

        // Valid admin role given
        $response = $client->request('PUT', '/repairers/21', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'enabled' => false,
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_OK);
        $response = $response->toArray();
        $this->assertSame($response['enabled'], false);
    }

    public function testPutEnabledByUserFail(): void
    {
        $client = self::createClientWithUserId(41);

        // Valid user role given
        $client->request('PUT', '/repairers/21', [
             'headers' => ['Content-Type' => 'application/json'],
             'json' => [
                 'description' => 'test put enabled failed',
                 'enabled' => true,
             ],
         ]);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Get the user 21 by admin to access to the enabled property
        $admin = self::createClientAuthAsAdmin();
        $response2 = $admin->request('GET', '/repairers/21');
        $response2 = $response2->toArray();
        $this->assertSame($response2['description'], 'test put enabled failed');
        $this->assertSame($response2['enabled'], false);
    }
}
