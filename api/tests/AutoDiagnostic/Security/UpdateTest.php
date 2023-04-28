<?php

namespace App\Tests\AutoDiagnostic\Security;

use App\Entity\AutoDiagnostic;
use App\Repository\AutoDiagnosticRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\Response;

class UpdateTest extends AbstractTestCase
{
    /** @var AutoDiagnostic[] */
    protected array $autoDiagnostics = [];

    public function setUp(): void
    {
        parent::setUp();

        $this->autoDiagnostics = static::getContainer()->get(AutoDiagnosticRepository::class)->findAll();
    }

    public function testUserCanPutAutoDiagnostic(): void
    {
        $autoDiagnostic = $this->autoDiagnostics[0];

        $this->createClientWithUser($autoDiagnostic->appointment->customer)->request('PUT', sprintf('/auto_diagnostics/%d', $autoDiagnostic->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'prestation' => 'update prestation',
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testAdminCanPutAutoDiagnostic(): void
    {
        $autoDiagnostic = $this->autoDiagnostics[0];

        $this->createClientAuthAsAdmin()->request('PUT', sprintf('/auto_diagnostics/%d', $autoDiagnostic->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'prestation' => 'update prestation 2',
            ],
        ]);

        $this->assertResponseIsSuccessful();
    }

    public function testUserCannotPutOtherDiagnostic(): void
    {
        // According to the fixtures, autoDiagnostics[5] is not assigned to the client auth as user
        $autoDiagnostic = $this->autoDiagnostics[5];

        $this->createClientAuthAsUser()->request('PUT', sprintf('/auto_diagnostics/%d', $autoDiagnostic->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'prestation' => 'update prestation',
            ],
        ]);
        $this->assertResponseStatusCodeSame(Response::HTTP_FORBIDDEN);
    }
}
