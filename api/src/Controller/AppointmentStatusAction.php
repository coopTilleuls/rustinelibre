<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Appointment;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Workflow\WorkflowInterface;

#[AsController]
final class AppointmentStatusAction
{
    public function __construct(private WorkflowInterface $appointmentAcceptanceStateMachine)
    {
    }

    public function __invoke(Appointment $appointment, Request $request): Appointment
    {
        $content = json_decode($request->getContent(), true);

        if (!array_key_exists('transition', $content)) {
            throw new BadRequestHttpException('You should provide a transition name');
        }

        if (!$this->appointmentAcceptanceStateMachine->can($appointment, $content['transition'])) {
            throw new BadRequestHttpException('This transition is currently not available');
        }

        $this->appointmentAcceptanceStateMachine->apply($appointment, $content['transition']);

        return $appointment;
    }
}
