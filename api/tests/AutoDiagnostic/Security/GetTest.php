<?php

declare(strict_types=1);

namespace App\Tests\AutoDiagnostic\Security;

use App\Entity\AutoDiagnostic;
use App\Entity\User;
use App\Repository\AutoDiagnosticRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class GetTest extends AbstractTestCase
{
    /** @var AutoDiagnostic[] */
    protected array $autoDiagnostics = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->autoDiagnostics = static::getContainer()->get(AutoDiagnosticRepository::class)->findAll();
    }

    public function testUserCanGetAutoDiagnostic(): void
    {
        $autoDiagnostic = $this->autoDiagnostics[0];

        $this->createClientWithUser($autoDiagnostic->appointment->customer)->request('GET', sprintf('/auto_diagnostics/%d', $autoDiagnostic->id));

        $this->assertResponseIsSuccessful();
    }

    public function testRepairerCanGetAutoDiagnostic(): void
    {
        $autoDiagnostic = $this->autoDiagnostics[0];
        $this->createClientWithUser($autoDiagnostic->appointment->repairer->owner)->request('GET', sprintf('/auto_diagnostics/%d', $autoDiagnostic->id));

        $this->assertResponseIsSuccessful();
    }

    public function testAdminCanGetAutoDiagnostic(): void
    {
        $autoDiagnostic = $this->autoDiagnostics[0];
        $this->createClientAuthAsAdmin()->request('GET', sprintf('/auto_diagnostics/%d', $autoDiagnostic->id));

        $this->assertResponseIsSuccessful();
    }

    public function testAdminCanGetAutoDiagnosticCollection(): void
    {
        $this->createClientAuthAsAdmin()->request('GET', sprintf('/auto_diagnostics'));

        $this->assertResponseIsSuccessful();
    }

    public function testUserCannotGetOtherDiagnostic(): void
    {
        // According to the fixtures, autoDiagnostics[5] is not assigned to the client auth as user
        $autoDiagnostic = $this->autoDiagnostics[5];
        $this->createClientAuthAsUser()->request('GET', sprintf('/auto_diagnostics/%d', $autoDiagnostic->id));
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
