<?php

declare(strict_types=1);

namespace App\Tests\AutoDiagnostic\Security;

use App\Entity\Appointment;
use App\Repository\AppointmentRepository;
use App\Tests\AbstractTestCase;
use App\Tests\Trait\AppointmentTrait;
use Symfony\Component\HttpFoundation\Response;

class CreateTest extends AbstractTestCase
{
    use AppointmentTrait;

    /** @var Appointment[] */
    protected array $appointments = [];

    private AppointmentRepository $appointmentRepository;

    public function setUp(): void
    {
        parent::setUp();

        $this->appointmentRepository = static::getContainer()->get(AppointmentRepository::class);
    }

    public function testUserCanCreateAutoDiagnostic(): void
    {
        $appointment = $this->appointmentRepository->getAppointmentWithoutAutoDiagnostic();

        $this->createClientWithUser($appointment->customer)->request('POST', '/auto_diagnostics', [
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
        $appointment = $this->appointmentRepository->getAppointmentWithoutAutoDiagnostic();

        $this->createClient()->request('POST', '/auto_diagnostics', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'appointment' => sprintf('/appointments/%d', $appointment->id),
                'prestation' => 'test prestation',
            ],
        ]);

        $this->assertResponseStatusCodeSame(Response::HTTP_UNAUTHORIZED);
    }

    public function testUserCannotCreateAutoDiagnosticIfNotOwner(): void
    {
        // According to the fixtures, the first appointment is assigned to the user_1 (id:4)
        $appointment = $this->getAppointment();
        if (null === $appointment) {
            self::fail('Appointment not found');
        }

        $this->createClientAuthAsUser()->request('POST', '/auto_diagnostics', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'appointment' => sprintf('/appointments/%d', $appointment->id),
                'prestation' => 'test prestation',
            ],
        ])->toArray();

        $this->assertResponseStatusCodeSame(Response::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'appointment: Ce rendez-vous concerne un autre utilisateur.',
        ]);
    }
}
