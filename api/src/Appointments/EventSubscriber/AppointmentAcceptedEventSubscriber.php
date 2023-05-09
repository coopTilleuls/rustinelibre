<?php

declare(strict_types=1);

namespace App\Appointments\EventSubscriber;

use App\Entity\Appointment;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs as BaseLifecycleEventArgs;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

final class AppointmentAcceptedEventSubscriber implements EventSubscriber
{
    public function __construct(private readonly MailerInterface $mailer,
                                private readonly string $mailerSender,
                                private readonly EntityManagerInterface $entityManager,
                                private readonly KernelInterface $kernel,
                                private readonly LoggerInterface $logger,
                                private readonly Environment $twig)
    {
    }

    public function getSubscribedEvents(): array
    {
        return [
            Events::postUpdate,
        ];
    }

    public function postUpdate(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof Appointment || in_array($this->kernel->getEnvironment(), ['dev', 'test'])) {
            return;
        }

        $changeSet = $this->entityManager->getUnitOfWork()->getEntityChangeSet($entity);
        if (!array_key_exists('accepted', $changeSet) || true !== $changeSet['accepted'][1]) {
            return;
        }

        $email = (new Email())
            ->from($this->mailerSender)
            ->to($entity->customer->email)
            ->subject('Votre rendez-vous a été accepté')
            ->html($this->twig->render('mail/appointment_accepted.html.twig', [
                'appointment' => $entity,
            ]));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('Accepted appointment mail not send: %s', $e->getMessage()));
        }
    }
}
