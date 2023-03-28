<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Repairer;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

class RepairerRruleEventSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private readonly FirstSlotAvailableCalculator $firstSlotAvailableCalculator,
        private readonly EntityManagerInterface $entityManager,
    ) {
    }

    public function postWrite(ViewEvent $event): void
    {
        $entity = $event->getControllerResult();

        if (!$entity instanceof Repairer) {
            return;
        }

        $originalData = $this->entityManager->getUnitOfWork()->getOriginalEntityData($entity);

        if ($entity->getRrule() !== $originalData['rrule']) {
            $this->firstSlotAvailableCalculator->setFirstSlotAvailable($entity);
        }
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => [
                ['postWrite', EventPriorities::POST_WRITE],
            ],
        ];
    }
}
