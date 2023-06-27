<?php

declare(strict_types=1);

namespace App\Appointments\EventSubscriber;

use App\Emails\ConfirmationEmail;
use App\Entity\Appointment;
use App\Entity\User;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\Workflow\Event\Event;

readonly class AppointmentWorkflowEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private ConfirmationEmail $confirmationEmail,
                                private EntityManagerInterface $entityManager,
                                private FirstSlotAvailableCalculator $firstSlotAvailableCalculator,
                                private RequestStack $requestStack,
                                private Security $security)
    {
    }

    public static function getSubscribedEvents()
    {
        return [
            'workflow.appointment_acceptance.transition.validated_by_repairer' => 'onValidatedByRepairer',
            'workflow.appointment_acceptance.transition.validated_by_cyclist' => 'onValidatedByCyclist',
            'workflow.appointment_acceptance.transition.refused' => 'onRefused',
            'workflow.appointment_acceptance.transition.propose_another_slot' => 'onProposeNewSlot',
            'workflow.appointment_acceptance.transition.cancellation' => 'onCancellation',
        ];
    }

    public function onValidatedByRepairer(Event $event): void
    {
        /** @var Appointment $appointment */
        $appointment = $event->getSubject();

        if (!$this->security->isGranted(User::ROLE_ADMIN) && !$this->security->isGranted(User::ROLE_BOSS) && !$this->security->isGranted(User::ROLE_EMPLOYEE)) {
            throw new AccessDeniedHttpException('access.denied.role');
        }

        $appointment->status = Appointment::VALIDATED;
        $this->entityManager->flush();

        $this->confirmationEmail->sendConfirmationEmail($appointment);
    }

    public function onValidatedByCyclist(Event $event): void
    {
        /** @var Appointment $appointment */
        $appointment = $event->getSubject();

        $appointment->status = Appointment::VALIDATED;
        $this->entityManager->flush();
    }

    public function onProposeNewSlot(Event $event): void
    {
        /** @var ?User $user */
        $user = $this->security->getUser();

        if (
            null === $user ||
            !($user->isAdmin() || $user->isBoss() || $user->isEmployee())
        ) {
            throw new AccessDeniedHttpException('access.denied.role');
        }

        /** @var Appointment $appointment */
        $appointment = $event->getSubject();

        $contentRequest = json_decode($this->requestStack->getCurrentRequest()->getContent(), true, 512, JSON_THROW_ON_ERROR);

        if (!array_key_exists('slotTime', $contentRequest)) {
            throw new BadRequestHttpException(sprintf('You should provide a new slotTime in your body request for the transition : %s', $event->getTransition()->getName()));
        }

        $appointment->status = Appointment::VALIDATED;
        $appointment->slotTime = new \DateTimeImmutable($contentRequest['slotTime']);
        $this->entityManager->flush();

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($appointment->repairer, true);
        $this->confirmationEmail->sendConfirmationEmail($appointment);
    }

    public function onRefused(Event $event): void
    {
        /** @var ?User $user */
        $user = $this->security->getUser();

        if (
            null === $user ||
            !($user->isAdmin() || $user->isBoss() || $user->isEmployee())
        ) {
            throw new AccessDeniedHttpException('access.denied.role');
        }

        /** @var Appointment $appointment */
        $appointment = $event->getSubject();

        // Update appointment
        $appointment->status = Appointment::REFUSED;
        $this->entityManager->flush();

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($appointment->repairer, true);
    }

    public function onCancellation(Event $event): void
    {
        /** @var Appointment $appointment */
        $appointment = $event->getSubject();

        // Update appointment
        $appointment->status = Appointment::CANCEL;
        $this->entityManager->flush();

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($appointment->repairer, true);
    }
}
