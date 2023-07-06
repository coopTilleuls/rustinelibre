<?php

declare(strict_types=1);

namespace App\Command;

use App\Notifications\FirebaseNotifier;
use App\Notifications\Notification;
use App\Repository\UserRepository;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(
    name: 'app:firebase',
)]
class FirebaseCommand extends Command
{
    public function __construct(
        private FirebaseNotifier $firebaseNotifier,
        private string $webAppUrl,
        private UserRepository $userRepository,
        string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $clement = $this->userRepository->findOneBy(['email' => 'clement@les-tilleuls.coop']);

        $notification = new Notification(
            recipient: $clement,
            title: 'Demande de RDV acceptée',
            body: 'Votre demande de RDV du %s a été confirmée',
            params: [
                'route' => sprintf('%s/rendez-vous/mes-rendez-vous', $this->webAppUrl),
            ]
        );

        $this->firebaseNotifier->sendNotification($notification);

        return Command::SUCCESS;
    }
}
