<?php

declare(strict_types=1);

namespace App\Emails;

use App\Entity\Appointment;
use App\Messages\Helpers\DiscussionManager;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

readonly class ConfirmationEmail
{
    public function __construct(private MailerInterface $mailer,
                                private string $mailerSender,
                                private string $webAppUrl,
                                private KernelInterface $kernel,
                                private LoggerInterface $logger,
                                private DiscussionManager $discussionManager,
                                private Environment $twig)
    {
    }

    public function sendConfirmationEmail(Appointment $appointment): void
    {
        if ('test' === $this->kernel->getEnvironment()) {
            return;
        }

        $email = (new Email())
            ->from($this->mailerSender)
            // ->to($appointment->customer->email)
            ->to('clement@les-tilleuls.coop')
            ->subject('Votre rendez-vous est confirmé')
            ->html($this->twig->render('mail/appointment_accepted.html.twig', [
                'appointment' => $appointment,
                'discussionUrl' => sprintf('%s/messagerie/%s', $this->webAppUrl, $this->discussionManager->getOrCreateDiscussion($appointment)->id),
                'annulationUrl' => sprintf('%s/annulation/%s', $this->webAppUrl, $appointment->id),
            ]));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('Accepted appointment mail not send: %s', $e->getMessage()));
        }
    }
}
