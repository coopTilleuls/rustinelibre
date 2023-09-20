<?php

declare(strict_types=1);

namespace App\Emails;

use App\Entity\Contact;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

readonly class NewContactEmail
{
    public function __construct(private MailerInterface $mailer,
        private string $mailerSender,
        private LoggerInterface $logger,
        private Environment $twig)
    {
    }

    public function sendNewContactEmail(Contact $contact): void
    {
        $email = (new Email())
            ->to($this->mailerSender)
            ->subject('Nouveau message reçu sur Rustine Libre')
            ->html($this->twig->render('mail/contact.html.twig', [
                'contact' => $contact,
            ]));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('Contact email not send, error: %s', $e->getMessage()));
        }
    }
}
