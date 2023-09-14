<?php

declare(strict_types=1);

namespace App\Emails;

use App\Entity\User;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

readonly class ValidationCodeEmail
{
    public function __construct(private MailerInterface $mailer,
        private string $mailerSender,
        private LoggerInterface $logger,
        private Environment $twig)
    {
    }

    public function sendValidationCodeEmail(User $user): void
    {
        $email = (new Email())
            ->from($this->mailerSender)
            ->to($user->email)
            ->subject('Votre code de confirmation Rustine Libre')
            ->html($this->twig->render('mail/send_validation_code.html.twig', [
                'user' => $user,
            ]));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('Confirmation code not send, error: %s', $e->getMessage()));
        }
    }
}
