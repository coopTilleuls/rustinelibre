<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Appointment;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Workflow\WorkflowInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

#[AsController]
final class AppointmentStatusAction
{
    public function __construct(private readonly WorkflowInterface $appointmentAcceptanceStateMachine, private readonly TranslatorInterface $translator)
    {
    }

    public function __invoke(Appointment $appointment, Request $request): Appointment
    {
        $content = json_decode($request->getContent(), true);

        if (!array_key_exists('transition', $content)) {
            throw new BadRequestHttpException($this->translator->trans('400_badRequest.appointment.transition', domain:'validators'));
        }

        if (!$this->appointmentAcceptanceStateMachine->can($appointment, $content['transition'])) {
            throw new BadRequestHttpException($this->translator->trans('400_badRequest.appointment.transition.not.available', domain:'validators'));
        }

        $this->appointmentAcceptanceStateMachine->apply($appointment, $content['transition']);

        return $appointment;
    }
}
