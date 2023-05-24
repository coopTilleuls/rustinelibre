<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Appointment;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Workflow\WorkflowInterface;

#[AsController]
final class AppointmentStatusAction extends AbstractController
{
    public function __construct(private WorkflowInterface $appointmentAcceptanceStateMachine)
    {
    }

    #[ParamConverter('appointment', class: Appointment::class)]
    public function __invoke(Request $request, Appointment $appointment): Response
    {
        $content = json_decode($request->getContent(), true);

        if (!array_key_exists('transition', $content)) {
            throw new BadRequestHttpException('You should provide a transition name');
        }

        if (!$this->appointmentAcceptanceStateMachine->can($appointment, $content['transition'])) {
            throw new BadRequestHttpException('This transition is currently not available');
        }

        $this->appointmentAcceptanceStateMachine->apply($appointment, $content['transition']);

        return new Response();
    }
}
