<?php

declare(strict_types=1);

namespace App\Tests\EventListener;

use Doctrine\DBAL\Connection;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\TerminateEvent;
use Symfony\Component\HttpKernel\KernelInterface;

readonly class KernelTerminateListener implements EventSubscriberInterface
{
    public function __construct(
        private Connection $connection,
        private KernelInterface $kernel,
    ) {
    }

    public function onKernelTerminate(TerminateEvent $event)
    {
        // close connection for test env
        if ('test' === $this->kernel->getEnvironment()) {
            $this->connection->close();
        }
    }

    public static function getSubscribedEvents()
    {
        return [
            'kernel.terminate' => 'onKernelTerminate',
        ];
    }
}
