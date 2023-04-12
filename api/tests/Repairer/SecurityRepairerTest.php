<?php

namespace App\Tests\Repairer;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityRepairerTest extends AbstractTestCase
{
/*    public function testPostRepairer(): void
    {
        $client = self::createClientAuthAsBoss();

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
        // classic user given
        $response = self::createClient()->request('POST', '/repairers', [
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
        $this->assertCount(25, $response['hydra:member']);
        $lastRepairer = end($response['hydra:member']);
        $this->assertSame($lastRepairer['enabled'], false);
    }

    public function testGetRepairerCollectionByUser(): void
    {
        $client = self::createClientAuthAsUser();
        // classic user given
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
        $response = $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Deuxième atelier du même boss',
            ],
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function testPostComment(): void
    {
        $client = self::createClientWithUserId(50);
        // Valid user given
        $response = $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Test comment',
                'description' => 'Test comment',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la clé',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/1', '/bike_types/2'],
                'comment' => 'Je voulais juste ajouter un commentaire',
            ],
        ]);
        $response = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertSame($response['comment'], 'Je voulais juste ajouter un commentaire');
    }*/
    public function testOwnerCreatedByUser() : void
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
            ]
        ]);
        $response = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertSame($response['owner'], '/users/16');
    }
    public function testOwnerSecurity() : void
    {
        $client = self::createClientWithUserId(15);
        // simple user given who try to assigne other owner
        $response = $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Test owner security',
                'owner' => '/users/52',
                'description' => 'Test owner security',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la clé',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/1'],
            ]
        ]);
        $response = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertSame($response['owner'], '/users/15');

    }
}
