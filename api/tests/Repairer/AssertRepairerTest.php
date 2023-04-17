<?php

namespace App\Tests\Repairer;

use App\Entity\User;
use App\Repository\BikeTypeRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class AssertRepairerTest extends AbstractTestCase
{
    private array $bikeTypes = [];

    /** @var User[] */
    private array $users = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->users = static::getContainer()->get(UserRepository::class)->findAll();
        $this->bikeTypes = static::getContainer()->get(BikeTypeRepository::class)->findAll();
    }

    public function testPostRepairerWithoutName(): void
    {
        $client = self::createClientWithUser($this->users[60]);

        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'description' => 'Tests Asserts on repairer',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la justice',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId(), '/bike_types/'.$this->bikeTypes[1]->getId()],
            ],
        ]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value should not be blank.',
        ]);
    }

    public function testPostRepairerWithShortName(): void
    {
        $client = self::createClientWithUser($this->users[60]);

        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                // Name with only one character
                'name' => 'A',
                'description' => 'Tests Asserts on repairer',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la justice',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId(), '/bike_types/'.$this->bikeTypes[1]->getId()],
            ],
        ]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value is too short. It should have 2 characters or more.',
        ]);
    }

    public function testPostRepairerWithLongName(): void
    {
        $client = self::createClientWithUser($this->users[60]);

        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                // Name with 82 characters
                'name' => 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eg',
                'description' => 'Tests Asserts on repairer',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la justice',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId(), '/bike_types/'.$this->bikeTypes[1]->getId()],
            ],
        ]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'name: This value is too long. It should have 80 characters or less.',
        ]);
    }

    public function testPostRepairerBadRequestDescription(): void
    {
        $client = self::createClientWithUser($this->users[60]);

        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Assert on repairers',
                // Description type !== string
                'description' => true,
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la justice',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId(), '/bike_types/'.$this->bikeTypes[1]->getId()],
            ],
        ]);
        self::assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        self::assertJsonContains([
            '@context' => '/contexts/Error',
            '@type' => 'hydra:Error',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'The type of the "description" attribute must be "string", "boolean" given.',
        ]);
    }

    public function testPostRepairerBadRequestPhone(): void
    {
        $client = self::createClientWithUser($this->users[60]);

        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Assert on repairers',
                'description' => 'Tests Asserts on repairer',
                // mobilePhone type !== string
                'mobilePhone' => true,
                'street' => '8 rue de la justice',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId(), '/bike_types/'.$this->bikeTypes[1]->getId()],
            ],
        ]);
        self::assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        self::assertJsonContains([
            '@context' => '/contexts/Error',
            '@type' => 'hydra:Error',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'The type of the "mobilePhone" attribute must be "string", "boolean" given.',
        ]);
    }

    public function testPostRepairerWithoutStreet(): void
    {
        $client = self::createClientWithUser($this->users[60]);

        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Assert on repairers',
                'description' => 'Tests Asserts on repairer',
                'mobilePhone' => '0720596321',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId(), '/bike_types/'.$this->bikeTypes[1]->getId()],
            ],
        ]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'street: This value should not be blank.',
        ]);
    }

    public function testPostRepairerWithoutCity(): void
    {
        $client = self::createClientWithUser($this->users[60]);

        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Assert on repairers',
                'description' => 'Tests Asserts on repairer',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la justice',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId(), '/bike_types/'.$this->bikeTypes[1]->getId()],
            ],
        ]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'city: This value should not be blank.',
        ]);
    }

    public function testPostRepairerBadRequestComment(): void
    {
        $client = self::createClientWithUser($this->users[60]);

        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Assert on repairers',
                'description' => 'Tests Asserts on repairer',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la justice',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId(), '/bike_types/'.$this->bikeTypes[1]->getId()],
                // comment type !== string
                'comment' => true,
            ],
        ]);
        self::assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        self::assertJsonContains([
            '@context' => '/contexts/Error',
            '@type' => 'hydra:Error',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'The type of the "comment" attribute must be "string", "boolean" given.',
        ]);
    }

    public function testPostRepairerBadRequestOpeningHours(): void
    {
        $client = self::createClientWithUser($this->users[60]);

        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Assert on repairers',
                'description' => 'Tests Asserts on repairer',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la justice',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId(), '/bike_types/'.$this->bikeTypes[1]->getId()],
                // opening hours type !== string
                'openingHours' => true,
            ],
        ]);
        self::assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        self::assertJsonContains([
            '@context' => '/contexts/Error',
            '@type' => 'hydra:Error',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'The type of the "openingHours" attribute must be "string", "boolean" given.',
        ]);
    }

    public function testPostRepairerBadOptionalPage(): void
    {
        $client = self::createClientWithUser($this->users[60]);

        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name' => 'Assert on repairers',
                'description' => 'Tests Asserts on repairer',
                'mobilePhone' => '0720596321',
                'street' => '8 rue de la justice',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->getId(), '/bike_types/'.$this->bikeTypes[1]->getId()],
                // optional page type !== string
                'optionalPage' => true,
            ],
        ]);
        self::assertResponseStatusCodeSame(Response::HTTP_BAD_REQUEST);
        self::assertJsonContains([
            '@context' => '/contexts/Error',
            '@type' => 'hydra:Error',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'The type of the "optionalPage" attribute must be "string", "boolean" given.',
        ]);
    }
}
