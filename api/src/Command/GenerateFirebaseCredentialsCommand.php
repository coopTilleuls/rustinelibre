<?php

declare(strict_types=1);

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:firebase:credentials',
)]
class GenerateFirebaseCredentialsCommand extends Command
{
    public function __construct(
        private string $projectDir,
        private string $firebaseProjectId,
        private string $firebasePrivateKey,
        private string $firebasePrivateKeyId,
        private string $firebaseClientEmail,
        private string $firebaseClientId,
        private string $firebaseAuthUri,
        private string $firebaseTokenUri,
        private string $firebaseAuthProvider,
        private string $firebaseClientCertUrl,
        private string $firebaseUniverseDomain,
        string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $credentials = [
            'type' => 'service_account',
            'project_id' => $this->firebaseProjectId,
            'private_key_id' => $this->firebasePrivateKeyId,
            'private_key' => $this->firebasePrivateKey,
            'client_email' => $this->firebaseClientEmail,
            'client_id' => $this->firebaseClientId,
            'auth_uri' => $this->firebaseAuthUri,
            'token_uri' => $this->firebaseTokenUri,
            'auth_provider_x509_cert_url' => $this->firebaseAuthProvider,
            'client_x509_cert_url' => $this->firebaseClientCertUrl,
            'universe_domain' => $this->firebaseUniverseDomain,
        ];

        $firebaseDir = sprintf('%s/config/firebase', $this->projectDir);
        if (!is_dir($firebaseDir)) {
            mkdir($firebaseDir);
        }

        $filePath = sprintf('%s/firebase-credentials.json', $firebaseDir);
        file_put_contents($filePath, json_encode($credentials, JSON_PRETTY_PRINT));

        $io->write('Firebase credentials generated');

        return Command::SUCCESS;
    }
}
