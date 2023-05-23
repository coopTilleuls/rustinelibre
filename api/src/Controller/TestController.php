<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\MediaObject;
use App\Repository\AppointmentRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Workflow\WorkflowInterface;

#[AsController]
 class TestController
{
    public function __construct(
        // Symfony will inject the 'blog_publishing' workflow configured before
        private WorkflowInterface $appointmentAcceptanceStateMachine,
    ) {
    }

    #[Route('/test', name: 'app_test')]
    public function testWorkflow(Request $request, AppointmentRepository $appointmentRepository)
    {
        $appointment = $appointmentRepository->find(10);

        $this->appointmentAcceptanceStateMachine->apply($appointment, 'accepted_by_repairer');

        return new Response();
    }
}
