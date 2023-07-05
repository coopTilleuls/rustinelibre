<?php

declare(strict_types=1);

namespace App\Command;

use App\Repository\UserRepository;
use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\AndroidConfig;
use Kreait\Firebase\Messaging\ApnsConfig;
use Kreait\Firebase\Messaging\CloudMessage;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:firebase',
)]
class FirebaseCommand extends Command
{
    public function __construct(
        private Messaging $messaging,
        private UserRepository $userRepository,
        string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $tokenFCM = $this->userRepository->findOneBy(['email' => 'clement@les-tilleuls.coop'])->firebaseToken;

        $message = CloudMessage::fromArray([
            'token' => $tokenFCM,
            'notification' => [
                'title' => 'Rustine libre notification',
                'body' => 'Contenu de la notification',
            ],
            'webpush' => [
                'headers' => [
                    'Urgency' => 'high'
                ]
            ]
        ]);

        $androidConfig = AndroidConfig::fromArray([
            'ttl' => '7200s',
            'priority' => 'normal',
            'notification' => [
                'title' => 'Rustine libre notification',
                'body' => 'Corps de la notification',
                'icon' => 'https://cdn-icons-png.flaticon.com/512/565/565422.png',
                'color' => '#f45342',
                'sound' => 'default',
            ],
            'data' => [
                'route' => '/messagerie/5'
            ]
        ]);

        $message = $message->withAndroidConfig($androidConfig);

        $config = ApnsConfig::fromArray([
            'headers' => [
                'apns-priority' => '10',
            ],
            'payload' => [
                'aps' => [
                    'alert' => [
                        'title' => 'Rustine libre notification',
                        'body' => 'Connecte toi mon grand',
                    ],
                    'badge' => 42,
                    'sound' => 'default',
                ],
            ],
        ]);

        $message = $message->withApnsConfig($config);

        // Envoyez le message à FCM
        $this->messaging->send($message);

        return Command::SUCCESS;
    }
}
