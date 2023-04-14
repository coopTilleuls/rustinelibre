<?php

namespace App\Tests\Repairer\Validator;

use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class RruleValidatorTest extends AbstractTestCase
{
    public function testCreateRepairer(): void
    {
        $this->createClientWithCredentials()->request('POST', '/repairers', ['json' => [
            'description' => 'Super atelier de vélo',
            'mobilePhone' => '0720397700',
            'street' => 'avenue Karl Marx',
            'city' => 'Lille',
            'postcode' => '59160',
            'country' => 'FRANCE',
            'rrule' => 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR',
        ]]);

        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testCreateInvalidRrule(): void
    {
        $this->createClientWithUserId(48)->request('POST', '/repairers', ['json' => [
            'street' => 'avenue P. Poutou',
            'city' => 'Lille',
            'description' => 'Super atelier de vélo',
            'rrule' => 'BAD RULE',
        ]]);

        $this->assertResponseStatusCodeSame(422);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');

        $this->assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'rrule: The string "BAD RULE" is not a valid iCalendar recurrence rule (RFC 5545).',
        ]);
    }
}
