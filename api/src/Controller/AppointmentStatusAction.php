<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Appointment;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Workflow\WorkflowInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

#[AsController]
final class AppointmentStatusAction extends AbstractController
{
    public function __construct(private readonly WorkflowInterface $appointmentAcceptanceStateMachine, private readonly TranslatorInterface $translator)
    {
    }

    #[ParamConverter('appointment', class: Appointment::class)]
    public function __invoke(Request $request, Appointment $appointment): Appointment
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
