<?php

declare(strict_types=1);

namespace App\Emails;

use App\Entity\Repairer;
use App\Entity\User;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

readonly class NewAccountEmail
{
    public function __construct(private MailerInterface $mailer,
        private string $mailerSender,
        private string $webAppUrl,
        private LoggerInterface $logger,
        private Environment $twig)
    {
    }

    public function sendConfirmationEmail(User $userEmployee, Repairer $repairer): void
    {
        $email = (new Email())
            ->from($this->mailerSender)
            ->to($userEmployee->email)
            ->subject('Votre compte sur Rustine Libre vient d\'être créé')
            ->html($this->twig->render('mail/employee_send_password.html.twig', [
                'webAppUrl' => $this->webAppUrl,
                'employee' => $userEmployee,
                'repairer' => $repairer,
            ]));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('New employee password email not send, error: %s', $e->getMessage()));
        }
    }
}
