<?php

namespace App\Tests\Repairer;

use App\Entity\Repairer;
use App\Entity\User;
use App\Repository\BikeTypeRepository;
use App\Repository\RepairerRepository;
use App\Repository\RepairerTypeRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityRepairerTest extends AbstractTestCase
{
    private array $bikeTypes = [];
    /** @var Repairer[] */
    private array $repairers = [];
    private array $repairerTypes = [];

    /** @var User[] */
    private array $users = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->users = static::getContainer()->get(UserRepository::class)->findAll();
        $this->repairers = static::getContainer()->get(RepairerRepository::class)->findAll();
        $this->bikeTypes = static::getContainer()->get(BikeTypeRepository::class)->findAll();
        $this->repairerTypes = static::getContainer()->get(RepairerTypeRepository::class)->findAll();
    }

    public function testPostRepairer(): void
    {
        $client = self::createClientWithUser($this->users[55]);

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
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId(), '/bike_types/'.$this->bikeTypes[1]->getId()],
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
    }

    public function testDeleteRepairer(): void
    {
        $client = self::createClientAuthAsAdmin();
        $client->request('DELETE', 'repairers/'.$this->repairers[23]->getId());
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
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId()],
                'latitude' => '50.6365654',
                'longitude' => '3.0635282',
            ],
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public function testGetRepairerByUser(): void
    {
        $client = self::createClientAuthAsUser();
        // classic user given
        $response = $client->request('GET', '/repairers/'.$this->repairers[5]->getId());
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertSame($response['name'], $this->repairers[5]->getName());
        $this->assertIsString($response['owner']);
        $this->assertSame($response['repairerType']['@id'], '/repairer_types/'.$this->repairers[5]->getRepairerType()->getId());
        $this->assertSame($response['openingHours'], $this->repairers[5]->getOpeningHours());
        $this->assertSame($response['optionalPage'], $this->repairers[5]->getOptionalPage());
        $this->assertArrayNotHasKey('enabled', $response);
    }

    public function testGetRepairerByAdmin(): void
    {
        $client = self::createClientAuthAsAdmin();
        // admin user given
        $response = $client->request('GET', '/repairers/'.$this->repairers[4]->getId());
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertSame($response['name'], $this->repairers[4]->getName());
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
        $client = self::createClientWithUser($this->users[55]);
        // Valid user role given but already have a repairer
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Deuxième atelier du même boss',
            ],
        ]);
        $this->assertResponseStatusCodeSame(422);
    }

    public function testOwnerCreatedByUser(): void
    {
        $client = self::createClientWithUser($this->users[93]);

        // simple user given
        $response = $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Test create by user',
                'description' => 'Test create by user',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[1]->getId()],
                'comment' => 'Je voulais juste ajouter un commentaire',
            ],
        ]);
        $response = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertSame($response['owner'], '/users/'.$this->users[93]->id);
        $this->assertSame($response['comment'], 'Je voulais juste ajouter un commentaire');
    }

    public function testOwnerSecurity(): void
    {
        $client = self::createClientWithUser($this->users[56]);
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
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId()],
            ],
        ]);
        $response = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertSame($response['owner'], '/users/'.$this->users[56]->id);
    }

    public function testPutEnabledByAdmin(): void
    {
        $client = self::createClientAuthAsAdmin();

        // Valid admin role given
        $response = $client->request('PUT', '/repairers/'.$this->repairers[20]->getId(), [
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
        // Get a random repairer
        $repairer = $this->repairers[20];
        // Disabled it
        $repairer->setEnabled(false);
        // Save it
        static::getContainer()->get(RepairerRepository::class)->save($repairer, true);

        // Owner try to enable it
        $client = self::createClientWithUser($repairer->getOwner());
        // Valid user role given
        $client->request('PUT', '/repairers/'.$repairer->getId(), [
             'headers' => ['Content-Type' => 'application/json'],
             'json' => [
                 'description' => 'test put enabled failed',
                 'enabled' => true,
             ],
         ]);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        // Get the user 21 by admin to access to the enabled property
        $admin = self::createClientAuthAsAdmin();
        $response2 = $admin->request('GET', '/repairers/'.$repairer->getId());
        $response2 = $response2->toArray();
        $this->assertSame($response2['description'], 'test put enabled failed');
        $this->assertSame($response2['enabled'], false);
    }
}
