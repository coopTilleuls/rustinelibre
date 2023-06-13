<?php

declare(strict_types=1);

namespace App\Tests\Repairer;

use App\Entity\Repairer;
use App\Entity\User;
use App\Repository\BikeTypeRepository;
use App\Repository\RepairerRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityRepairerTest extends AbstractTestCase
{
    private array $bikeTypes = [];
    /** @var Repairer[] */
    private array $repairers = [];

    /** @var User[] */
    private array $users = [];

    private UserRepository $userRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->users = static::getContainer()->get(UserRepository::class)->findAll();
        $this->repairers = static::getContainer()->get(RepairerRepository::class)->findAll();
        $this->bikeTypes = static::getContainer()->get(BikeTypeRepository::class)->findAll();
        $this->userRepository = static::getContainer()->get(UserRepository::class);
    }

    public function testPostRepairer(): void
    {
        $user = $this->userRepository->getUserWithoutRepairer();

        if (null === $user) {
            self::fail('No user without repairer found');
        }

        $client = $this->createClientWithUser($user);

        // Valid boss role given
        $response = $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Chez Jojo',
                'description' => 'On aime réparer des trucs',
                'mobilePhone' => '0720596321',
                'street' => 'rue de la clé',
                'streetNumber' => '8',
                'city' => 'Lille',
                'postcode' => '59000',
                'latitude' => '50.62544631958008',
                'longitude' => '3.0352721214294434',
                'country' => 'France',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->id, '/bike_types/'.$this->bikeTypes[1]->id],
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $response = $response->toArray();
        // Check the slug on create
        $this->assertSame($response['slug'], 'chez-jojo');
    }

    public function testDeleteRepairer(): void
    {
        $client = self::createClientAuthAsAdmin();
        $client->request('DELETE', 'repairers/'.$this->repairers[23]->id);
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
                'street' => 'rue de la clé',
                'streetNumber' => '8',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->id],
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
        $response = $client->request('GET', '/repairers/'.$this->repairers[5]->id);
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertSame($response['name'], $this->repairers[5]->name);
        $this->assertIsString($response['owner']);
        $this->assertSame($response['repairerType']['@id'], '/repairer_types/'.$this->repairers[5]->repairerType->id);
        $this->assertSame($response['openingHours'], $this->repairers[5]->openingHours);
        $this->assertArrayNotHasKey('enabled', $response);
    }

    public function testGetRepairerByAdmin(): void
    {
        $client = self::createClientAuthAsAdmin();
        // admin user given
        $response = $client->request('GET', '/repairers/'.$this->repairers[4]->id);
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertSame($response['name'], $this->repairers[4]->name);
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
        $enabledRepairers = static::getContainer()->get(RepairerRepository::class)->findBy(['enabled' => true]);
        $response = $response['hydra:member'];
        $this->assertEquals(count($enabledRepairers), count($response));

        // test first array key result for enabled filter
        $firstRepairer = $client->request('GET', sprintf('/repairers/%d', $response[0]['id']))->toArray();
        $this->assertSame(true, $firstRepairer['enabled']);

        // test last array key result for enabled filter
        $lastRepairer = $client->request('GET', sprintf('/repairers/%d', end($response)['id']))->toArray();
        $this->assertSame(true, $lastRepairer['enabled']);
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
        $this->assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
    }

    public function testOwnerCreatedByUser(): void
    {
        $user = $this->userRepository->getUserWithoutRepairer();

        if (null === $user) {
            $this->fail('No user found without repairer');
        }

        $client = $this->createClientWithUser($user);

        // simple user given
        $response = $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Test create by user',
                'description' => 'Test create by user',
                'street' => 'rue de Wazemmes',
                'streetNumber' => '12',
                'city' => 'Lille',
                'postcode' => '59000',
                'latitude' => '50.62285232543945',
                'longitude' => '3.0607175827026367',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[1]->id],
                'comment' => 'Je voulais juste ajouter un commentaire',
            ],
        ]);
        $response = $response->toArray();
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertSame($response['owner'], '/users/'.$user->id);
        $this->assertSame($response['comment'], 'Je voulais juste ajouter un commentaire');
    }

    public function testPutEnabledByAdmin(): void
    {
        // Valid admin role given
        $response = self::createClientAuthAsAdmin()->request('PUT', sprintf('/repairers/%s', $this->repairers[20]->id), [
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

    public function testSlugByPut(): void
    {
        // Get a random repairer
        $repairer = $this->repairers[20];
        // enabled it
        $repairer->enabled = true;
        // Save it
        static::getContainer()->get(RepairerRepository::class)->save($repairer, true);

        // Valid user role given
        $response = self::createClientWithUser($repairer->owner)->request('PUT', sprintf('/repairers/%s', $repairer->id), [
             'headers' => ['Content-Type' => 'application/json'],
             'json' => [
                 'name' => 'New Name',
                 'description' => 'test slug by put',
             ],
         ]);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $response = $response->toArray();
        $this->assertSame($response['description'], 'test slug by put');
        // test slug on update
        $this->assertSame($response['slug'], 'new-name');
    }
}
