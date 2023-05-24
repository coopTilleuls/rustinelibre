<?php

declare(strict_types=1);

namespace App\Appointments\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Appointment;
use App\Entity\Repairer;
use App\Entity\User;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Symfony\Component\Workflow\Event\Event;
use Twig\Environment;

readonly class AppointmentEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private MailerInterface $mailer,
                                private string $mailerSender,
                                private KernelInterface $kernel,
                                private LoggerInterface $logger,
                                private Environment $twig)
    {
    }

    public static function getSubscribedEvents()
    {
        return [
            'workflow.appointment_acceptance.transition.accepted_by_repairer' => 'onAcceptedByRepairer',
        ];
    }

    public function onAcceptedByRepairer(Event $event): void
    {
        $this->sendAcceptanceEmail($event->getSubject());
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
