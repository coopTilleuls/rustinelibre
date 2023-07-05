<?php

declare(strict_types=1);

namespace App\Employees\EventSubscriber;

use App\Entity\RepairerEmployee;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs as BaseLifecycleEventArgs;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

final class EmployeeSendPasswordEventSubscriber implements EventSubscriber
{
    public function __construct(private readonly MailerInterface $mailer,
        private readonly string $mailerSender,
        private readonly string $webAppUrl,
        private readonly KernelInterface $kernel,
        private readonly LoggerInterface $logger,
        private readonly Environment $twig)
    {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
        ];
    }

    public function postPersist(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof RepairerEmployee) {
            return;
        }

        $userEmployee = $entity->employee;
        $email = (new Email())
            ->from($this->mailerSender)
            ->to($userEmployee->email)
            ->subject('Votre compte sur Rustine Libre vient d\'être créé')
            ->html($this->twig->render('mail/employee_send_password.html.twig', [
                'webAppUrl' => $this->webAppUrl,
                'employee' => $userEmployee,
                'repairer' => $entity->repairer,
            ]));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('New employee password email not send, error: %s', $e->getMessage()));
        }

        $userEmployee->eraseCredentials();
    }
}
