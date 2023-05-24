<?php

declare(strict_types=1);

namespace App\Appointments\EventSubscriber;

use App\Entity\Appointment;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Workflow\Event\Event;
use Twig\Environment;

readonly class AppointmentWorkflowEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private MailerInterface $mailer,
                                private string $mailerSender,
                                private KernelInterface $kernel,
                                private LoggerInterface $logger,
                                private EntityManagerInterface $entityManager,
                                private FirstSlotAvailableCalculator $firstSlotAvailableCalculator,
                                private RequestStack $requestStack,
                                private Security $security,
                                private Environment $twig)
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

        if (!$this->security->isGranted('ROLE_ADMIN') && !$this->security->isGranted('ROLE_BOSS') && !$this->security->isGranted('ROLE_EMPLOYEE')) {
            throw new AccessDeniedHttpException();
        }

        $appointment->status = Appointment::VALIDATED;
        $this->entityManager->flush();

        $this->sendAcceptanceEmail($appointment);
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
        /** @var Appointment $appointment */
        $appointment = $event->getSubject();

        $contentRequest = json_decode($this->requestStack->getCurrentRequest()->getContent(), true);

        if (!array_key_exists('slotTime', $contentRequest)) {
            throw new BadRequestHttpException(sprintf('You should provide a new slotTime in your body request for the transition : %s', $event->getTransition()->getName()));
        }

        $appointment->status = Appointment::PENDING_CYCLIST;
        $appointment->slotTime = new \DateTimeImmutable($contentRequest['slotTime']);
        $this->entityManager->flush();

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($appointment->repairer, true);
    }

    public function onRefused(Event $event): void
    {
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

    private function sendAcceptanceEmail(Appointment $appointment): void
    {
        if (in_array($this->kernel->getEnvironment(), ['dev', 'test'])) {
            return;
        }

        $email = (new Email())
            ->from($this->mailerSender)
            ->to($appointment->customer->email)
            ->subject('Votre rendez-vous a été accepté')
            ->html($this->twig->render('mail/appointment_accepted.html.twig', [
                'appointment' => $appointment,
            ]));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('Accepted appointment mail not send: %s', $e->getMessage()));
        }
    }
}
