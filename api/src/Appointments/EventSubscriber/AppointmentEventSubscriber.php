<?php

declare(strict_types=1);

namespace App\Appointments\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Appointment;
use App\Entity\Repairer;
use App\Entity\User;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

readonly class AppointmentEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private MailerInterface $mailer,
                                private string $mailerSender,
                                private FirstSlotAvailableCalculator $firstSlotAvailableCalculator,
                                private KernelInterface $kernel,
                                private LoggerInterface $logger,
                                private EntityManagerInterface $entityManager,
                                private Security $security,
                                private Environment $twig)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['updateAppointmentStatus', EventPriorities::PRE_WRITE],
        ];
    }

    public function updateAppointmentStatus(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof Appointment || Request::METHOD_PUT !== $method) {
            return;
        }

        $originalStatus = $this->entityManager->getUnitOfWork()->getOriginalEntityData($object)['status'];
        $newStatus = $object->status;

        // Appointment acceptance
        if (Appointment::PENDING_REPAIRER === $originalStatus && Appointment::VALIDATED === $newStatus) {
            if (!$this->security->isGranted('ROLE_ADMIN') && !$this->security->isGranted('ROLE_BOSS') && !$this->security->isGranted('ROLE_EMPLOYEE')) {
                throw new AccessDeniedHttpException('You cannot accept an appointment');
            }

            /** @var User $currentUser */
            $currentUser = $this->security->getUser();
            $currentUserIsBoss = $this->security->isGranted('ROLE_BOSS') && $currentUser->repairer !== $object->repairer;
            $currentUserIsEmployee = $this->security->isGranted('ROLE_EMPLOYEE') && (!$currentUser->repairerEmployee || $currentUser->repairerEmployee->repairer !== $object->repairer);

            if ($currentUserIsBoss || $currentUserIsEmployee) {
                throw new AccessDeniedHttpException('You cannot accept this appointment');
            }

            $this->sendAcceptanceEmail($object);
        }

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($object->repairer, true);
    }

    private function sendAcceptanceEmail(Appointment $appointment): void
    {
        if (in_array($this->kernel->getEnvironment(), ['dev', 'test'])) {
            return;
        }

        $email = (new Email())
            ->from($this->mailerSender)
            ->to($appointment->customer->email)
            ->subject('Votre rendez-vous a été accepté')
            ->html($this->twig->render('mail/appointment_accepted.html.twig', [
                'appointment' => $appointment,
            ]));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('Accepted appointment mail not send: %s', $e->getMessage()));
        }
    }
}
