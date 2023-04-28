<?php

declare(strict_types=1);

namespace App\Tests\AutoDiagnostic\Security;

use App\Entity\Appointment;
use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class CreateTest extends AbstractTestCase
{
    /** @var Appointment[] */
    protected array $appointments = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->appointments = static::getContainer()->get(AppointmentRepository::class)->findAll();
    }

    public function testUserCanCreateAutoDiagnostic(): void
    {
        $appointment = $this->appointments[0];

        $this->createClientAuthAsUser()->request('POST', '/auto_diagnostics', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'appointment' => sprintf('/appointments/%d', $appointment->id),
                'prestation' => 'test prestation',
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testUserDisconnectedCannotCreateAutoDiagnostic(): void
    {
        $appointment = $this->appointments[0];

        $this->createClient()->request('POST', '/auto_diagnostics', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'appointment' => sprintf('/appointments/%d', $appointment->id),
                'prestation' => 'test prestation',
            ],
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }
}
