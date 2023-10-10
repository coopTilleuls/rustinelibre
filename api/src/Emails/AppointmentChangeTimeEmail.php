<?php

declare(strict_types=1);

namespace App\Emails;

use App\Entity\Appointment;
use App\Entity\Repairer;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

readonly class AppointmentChangeTimeEmail
{
    public function __construct(private MailerInterface $mailer,
        private string $webAppUrl,
        private LoggerInterface $logger,
        private Environment $twig)
    {
    }

    public function sendChangeTimeEmail(Appointment $appointment, Repairer $repairer): void
    {
        try {
            $email = (new Email())
                ->to($appointment->customer->email)
                ->subject('Votre RDV a été modifié')
                ->html($this->twig->render('mail/appointment_change_time.html.twig', [
                    'appointment' => $appointment,
                    'rdvUrl' => sprintf('%s/rendez-vous/mes-rendez-vous', $this->webAppUrl),
                ]));

            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('Refused appointment mail not send: %s', $e->getMessage()));
        }
    }
}
