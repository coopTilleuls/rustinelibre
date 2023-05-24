<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\Appointment;
use App\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\ParamConverter;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\Workflow\WorkflowInterface;

#[AsController]
final class RepairerAcceptAppointmentAction extends AbstractController
{
    public function __construct(
        private WorkflowInterface $appointmentAcceptanceStateMachine,
        private Security $security,
    ) {
    }

    #[ParamConverter('appointment', class: Appointment::class)]

    public function __invoke(Request $request, Appointment $appointment): Response
    {
        /** @var User $currentUser */
        $currentUser = $this->security->getUser();
        $currentUserIsBoss = $this->security->isGranted('ROLE_BOSS') && $currentUser->repairer !== $appointment->repairer;
        $currentUserIsEmployee = $this->security->isGranted('ROLE_EMPLOYEE') && (!$currentUser->repairerEmployee || $currentUser->repairerEmployee->repairer !== $appointment->repairer);

        if ($currentUserIsBoss || $currentUserIsEmployee) {
            throw new AccessDeniedHttpException('You cannot accept this appointment');
        }

        $this->appointmentAcceptanceStateMachine->apply($appointment, 'accepted_by_repairer');

        return new Response();
    }
}
