<?php

declare(strict_types=1);

namespace App\Tests\Repairer;

use App\Entity\User;
use App\Repository\BikeTypeRepository;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;

class AssertRepairerTest extends AbstractTestCase
{
    private array $bikeTypes = [];

    /** @var User[] */
    private array $users = [];

    private TranslatorInterface $translator;

    public function setUp(): void
    {
        parent::setUp();

        $this->users = static::getContainer()->get(UserRepository::class)->findAll();
        $this->bikeTypes = static::getContainer()->get(BikeTypeRepository::class)->findAll();
        $this->translator = static::getContainer()->get(TranslatorInterface::class);
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
                'street' => 'rue de la justice',
                'streetNumber' => '8',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->id, '/bike_types/'.$this->bikeTypes[1]->id],
            ],
        ]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => sprintf('name: %s', $this->translator->trans('repairer.name.not_blank', domain: 'validators')),
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
                'street' => 'rue de la justice',
                'streetNumber' => '16',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->id, '/bike_types/'.$this->bikeTypes[1]->id],
            ],
        ]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => sprintf('name: %s', $this->translator->trans('repairer.name.min_length', domain: 'validators')),
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
                'street' => 'rue de la justice',
                'streetNumber' => '8',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->id, '/bike_types/'.$this->bikeTypes[1]->id],
            ],
        ]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => sprintf('name: %s', $this->translator->trans('repairer.name.max_length', domain: 'validators')),
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
                'street' => 'rue de la justice',
                'streetNumber' => '8',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->id, '/bike_types/'.$this->bikeTypes[1]->id],
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
                'street' => 'rue de la justice',
                'streetNumber' => '8',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->id, '/bike_types/'.$this->bikeTypes[1]->id],
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
                'street' => 'rue de la justice',
                'streetNumber' => '8',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->id, '/bike_types/'.$this->bikeTypes[1]->id],
            ],
        ]);
        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => sprintf('city: %s', $this->translator->trans('repairer.city.not_blank', domain: 'validators')),
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
                'street' => 'rue de la justice',
                'streetNumber' => '8',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->id, '/bike_types/'.$this->bikeTypes[1]->id],
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
                'street' => 'rue de la justice',
                'streetNumber' => '8',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->id, '/bike_types/'.$this->bikeTypes[1]->id],
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
                'street' => 'rue de la justice',
                'streetNumber' => '8',
                'city' => 'Lille',
                'postcode' => '59000',
                'country' => 'France',
                'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported' => ['/bike_types/'.$this->bikeTypes[0]->id, '/bike_types/'.$this->bikeTypes[1]->id],
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
