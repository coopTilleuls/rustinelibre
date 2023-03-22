<?php

namespace App\Tests\Location\Validator;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Repairer;

class RruleValidatorTest extends ApiTestCase
{
    public function testCreateLocation(): void
    {
        $randomRepairer = static::getContainer()->get('doctrine')->getRepository(Repairer::class)->findOneBy([]);
        static::createClient()->request('POST', '/locations', ['json' => [
            'repairer' => '/repairers/'.$randomRepairer->getId(),
            'street' => 'avenue Karl Marx',
            'city' => 'Lille',
        ]]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertResponseHeaderSame('content-type', 'application/ld+json; charset=utf-8');
    }

    public function testCreateInvalidRrule(): void
    {
        $randomRepairer = static::getContainer()->get('doctrine')->getRepository(Repairer::class)->findOneBy([]);
        static::createClient()->request('POST', '/locations', ['json' => [
            'repairer' => '/repairers/'.$randomRepairer->getId(),
            'street' => 'avenue P. Poutou',
            'city' => 'Lille',
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
