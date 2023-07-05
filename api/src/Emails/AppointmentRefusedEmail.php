<?php

declare(strict_types=1);

namespace App\Emails;

use App\Entity\Appointment;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

readonly class AppointmentRefusedEmail
{
    public function __construct(private MailerInterface $mailer,
                                private string $mailerSender,
                                private string $webAppUrl,
                                private LoggerInterface $logger,
                                private Environment $twig)
    {
    }

    public function sendNewAppointmentEmail(Appointment $appointment): void
    {
        try {
            $email = (new Email())
                ->from($this->mailerSender)
                ->to($appointment->customer->email)
                ->subject('Votre demande de RDV a été refusée')
                ->html($this->twig->render('mail/appointment_refused.html.twig', [
                    'appointment' => $appointment,
                    'homepageUrl' => $this->webAppUrl
                ]));

            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('Refused appointment mail not send: %s', $e->getMessage()));
        }
    }
}
