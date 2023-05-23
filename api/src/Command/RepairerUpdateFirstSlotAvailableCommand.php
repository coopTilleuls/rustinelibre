<?php

namespace App\Command;

use App\Repairers\Service\UpdateOldFirstSlotAvailableService;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:repairer:update-first-slot-available',
    description: 'Add a short description for your command',
)]
class RepairerUpdateFirstSlotAvailableCommand extends Command
{
    public function __construct(
        private readonly UpdateOldFirstSlotAvailableService $updateOldFirstSlotAvailableService,
        string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $this->updateOldFirstSlotAvailableService->updateOldFirstSlotAvailable();

        $io->success('All repairer have been updated');

        return Command::SUCCESS;
    }
}
