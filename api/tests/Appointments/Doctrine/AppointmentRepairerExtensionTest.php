<?php

declare(strict_types=1);

namespace App\Tests\Appointments\Doctrine;

use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;
use App\Tests\Trait\AppointmentTrait;

class AppointmentRepairerExtensionTest extends AbstractTestCase
{
    use AppointmentTrait;

    public function setUp(): void
    {
        parent::setUp();
        $this->appointmentRepository = self::getContainer()->get(AppointmentRepository::class);
    }

    public function testCustomerGetOnlyHisAppointments(): void
    {
        $appointment = $this->getAppointment();

        if (!in_array('ROLE_BOSS', $appointment->repairer->owner->getRoles(), true)) {
            self::fail('The user is not a boss');
        }

        $response = $this->createClientWithUser($appointment->repairer->owner)->request('GET', '/appointments')->toArray();

        self::assertResponseIsSuccessful();
        self::assertGreaterThan(0, count($response['hydra:member']));
        foreach ($response['hydra:member'] as $result) {
            self::assertSame(sprintf('/repairers/%d', $appointment->repairer->id), $result['repairer']['@id']);
        }
    }
}
