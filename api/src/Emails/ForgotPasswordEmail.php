<?php

declare(strict_types=1);

namespace App\Emails;

use App\Entity\User;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

readonly class ForgotPasswordEmail
{
    public function __construct(private MailerInterface $mailer,
        private string $mailerSender,
        private string $webAppUrl,
        private LoggerInterface $logger,
        private Environment $twig)
    {
    }

    public function sendForgotPasswordEmail(User $user): void
    {
        try {
            $email = (new Email())
                ->from($this->mailerSender)
                ->to($user->email)
                ->subject('Mot de passe oublié')
                ->html($this->twig->render('mail/forgot_password.html.twig', [
                    'user' => $user,
                    'changePasswordUrl' => sprintf('%s/reinitialiser-mot-de-passe?token=%s', $this->webAppUrl, $user->forgotPasswordToken),
                ]));

            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('Accepted appointment mail not send: %s', $e->getMessage()));
        }
    }
}
