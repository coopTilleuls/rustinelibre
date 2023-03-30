<?php

namespace App\Tests\Repairer;

use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class SecurityRepairerTest extends AbstractTestCase
{
    public function testPostRepairer(): void
    {
        $client = self::createClientAuthAsBoss();


        // Valid boss role given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name'=> 'Chez Jojo',
                'owner'=> '/users/3',
                'description'=> "On aime réparer des trucs",
                'mobilePhone'=> "0720596321",
                'street'=> "8 rue de la clé",
                'city'=> "Lille",
                'postcode'=> "59000",
                'country'=> "France",
                'rrule'=> 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported'=> ['/bike_types/1', '/bike_types/2'],
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
    }

    public function testPostRepairerFail(): void
    {
        $client = self::createClientAuthAsUser();

        // classic user given
        $client->request('POST', '/repairers', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'name'=> 'Chez Jojo',
                'owner'=> '/users/4',
                'description'=> "On aime réparer des trucs",
                'mobilePhone'=> "0720596321",
                'street'=> "8 rue de la clé",
                'city'=> "Lille",
                'postcode'=> "59000",
                'country'=> "France",
                'rrule'=> 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
                'bikeTypesSupported'=> ['/bike_types/1'],
                'latitude'=> '50.6365654',
                'longitude'=> '3.0635282',
            ],
        ]);
        $this->assertResponseStatusCodeSame(403);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testGetRepairer(): void
    {
        $client = self::createClientAuthAsUser();
        // classic user given
        $response = $client->request('GET', '/repairers/4');
        $this->assertResponseIsSuccessful();
        $response = $response->toArray();
        $this->assertIsArray($response);
        $this->assertSame($response['name'], 'Chez Jojo');
    }
}
