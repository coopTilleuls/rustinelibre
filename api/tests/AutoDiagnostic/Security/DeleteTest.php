<?php

namespace App\Tests\AutoDiagnostic\Security;

use App\Entity\AutoDiagnostic;
use App\Repository\AutoDiagnosticRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class DeleteTest extends AbstractTestCase
{
    /** @var AutoDiagnostic[] */
    protected array $autoDiagnostics = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->autoDiagnostics = static::getContainer()->get(AutoDiagnosticRepository::class)->findAll();
    }

    public function testUserCanDeleteMaintenanceForOwnBike(): void
    {
        $autoDiagnostic = $this->autoDiagnostics[0];

        $this->createClientWithUser($autoDiagnostic->appointment->customer)->request('DELETE', sprintf('/auto_diagnostics/%d', $autoDiagnostic->id));

        $this->assertResponseIsSuccessful();
    }

    public function testAdminCanDeleteMaintenanceForUserBike(): void
    {
        $autoDiagnostic = $this->autoDiagnostics[0];

        $this->createClientAuthAsAdmin()->request('DELETE', sprintf('/auto_diagnostics/%d', $autoDiagnostic->id));

        $this->assertResponseIsSuccessful();
    }

    public function testUserCannotDeleteAutoDiagnostic(): void
    {
        $autoDiagnostic = $this->autoDiagnostics[0];

        $this->createClientAuthAsUser()->request('DELETE', sprintf('/auto_diagnostics/%d', $autoDiagnostic->id));

        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
