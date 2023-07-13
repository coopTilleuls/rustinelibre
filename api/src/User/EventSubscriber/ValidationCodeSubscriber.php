<?php

declare(strict_types=1);

namespace App\User\EventSubscriber;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs as BaseLifecycleEventArgs;
use Psr\Log\LoggerInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;
use Twig\Environment;

#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::postPersist)]
final class ValidationCodeSubscriber
{
    public function __construct(private MailerInterface $mailer,
        private string $mailerSender,
        private LoggerInterface $logger,
        private Environment $twig)
    {
    }

    public function prePersist(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof User) {
            return;
        }

        $entity->validationCode = random_int(1000, 9999);
    }

    public function postPersist(BaseLifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof User) {
            return;
        }

        $this->sendValidationCodeByEmail($entity);
    }

    private function sendValidationCodeByEmail(User $user): void
    {
        $email = (new Email())
            ->from($this->mailerSender)
            ->to($user->email)
            ->subject('Votre code de confirmation La Rustine Libre')
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
