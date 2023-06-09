<?php

declare(strict_types=1);

namespace App\Command;

use App\Appointments\Services\AppointmentsCanceller;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:appointments:cancel-old',
    description: 'Cancel past appointments',
)]
class CancelAppointmentsPastOrDelayedCommand extends Command
{
    public function __construct(
        private readonly AppointmentsCanceller $appointmentsCanceller,
        string $name = null,
    ) {
        parent::__construct($name);
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $this->appointmentsCanceller->cancelOldAppointments();

        $io->success('All old appointments have been updated');

        return Command::SUCCESS;
    }
}
