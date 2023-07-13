<?php

declare(strict_types=1);

namespace App\Contact\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Contact;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

readonly class ContactEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private MailerInterface $mailer,
        private string $mailerSender,
        private LoggerInterface $logger,
        private Environment $twig)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['sendContactMail', EventPriorities::POST_WRITE],
        ];
    }

    public function sendContactMail(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof Contact || Request::METHOD_POST !== $method) {
            return;
        }

        $email = (new Email())
            ->from($this->mailerSender)
            ->to($this->mailerSender)
            ->subject('Nouveau message reçu sur La Rustine Libre')
            ->html($this->twig->render('mail/contact.html.twig', [
                'contact' => $object,
            ]));

        try {
            $this->mailer->send($email);
        } catch (\Exception $e) {
            $this->logger->alert(sprintf('Contact email not send, error: %s', $e->getMessage()));
        }
    }
}
