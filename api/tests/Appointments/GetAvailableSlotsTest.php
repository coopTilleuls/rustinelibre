<?php

declare(strict_types=1);

namespace App\Tests\Appointments;

use App\Entity\Repairer;
use App\Repository\RepairerRepository;
use App\Tests\AbstractTestCase;

class GetAvailableSlotsTest extends AbstractTestCase
{
    private ?Repairer $repairer = null;

    public function setUp(): void
    {
        parent::setUp();
        $this->repairer = static::getContainer()->get(RepairerRepository::class)->findAll()[0];
    }

    // public function testGetSlotsAvailable(): void
    // {
    //     // @todo
    // }
}