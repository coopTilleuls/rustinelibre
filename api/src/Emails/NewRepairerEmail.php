<?php

declare(strict_types=1);

namespace App\Emails;

use App\Entity\Repairer;
use App\Entity\User;
use App\Repository\UserRepository;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

readonly class NewRepairerEmail
{
    public function __construct(private MailerInterface $mailer,
        private string $mailerSender,
        private UserRepository $userRepository,
        private string $webAppUrl,
        private LoggerInterface $logger,
        private Environment $twig)
    {
    }

    public function sendAdminNewRepairerEmail(Repairer $repairer): void
    {
        $admins = $this->userRepository->getUsersWithRole('ROLE_ADMIN');

        $adminEmails = array_map(function (User $user) {
            return $user->email;
        }, $admins);

        $email = (new Email())
            ->from($this->mailerSender)
            ->to(...$adminEmails)
            ->subject("Demande d'inscription réparateur")
            ->html($this->twig->render('mail/admin_new_repairer.html.twig', [
                'repairer' => $repairer,
                'repairerAdminUrl' => sprintf('%s/admin/reparateurs', $this->webAppUrl),
            ]));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('New repairer email not send, error: %s', $e->getMessage()));
        }
    }

    public function sendRepairerEmail(Repairer $repairer): void
    {
        $email = (new Email())
            ->from($this->mailerSender)
            ->to($repairer->owner->email)
            ->subject("Demande d'inscription réparateur")
            ->html($this->twig->render('mail/new_repairer.html.twig'));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('New repairer email not send, error: %s', $e->getMessage()));
        }
    }

    public function sendRepairerValidationEmail(Repairer $repairer): void
    {
        $email = (new Email())
            ->from($this->mailerSender)
            ->to($repairer->owner->email)
            ->subject("Votre demande d'inscription a été validée")
            ->html($this->twig->render('mail/new_repairer_validated.html.twig'));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('New repairer email not send, error: %s', $e->getMessage()));
        }
    }
}
