<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Appointment;
use App\Entity\Repairer;
use App\Entity\RepairerExceptionalClosure;
use App\Entity\RepairerOpeningHours;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class SlotsAvailableEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private EntityManagerInterface $entityManager,
                                private FirstSlotAvailableCalculator $firstSlotAvailableCalculator)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => [
                ['preRemove', EventPriorities::PRE_WRITE], // Before remove an opening hours, exceptional closure, appointment
                ['postWrite', EventPriorities::POST_WRITE], // Before create an opening hours, exceptional closure, appointment
                ['preUpdateAppointment', EventPriorities::PRE_WRITE], // When an appointment is accepted
                ['preUpdateRepairer', EventPriorities::PRE_WRITE], // When a repairer slots system change
            ],
        ];
    }

    public function preRemove(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ((!$object instanceof RepairerExceptionalClosure && !$object instanceof RepairerOpeningHours && !$object instanceof Appointment) || Request::METHOD_DELETE !== $method) {
            return;
        }

        $this->entityManager->remove($object);
        $this->entityManager->flush();

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($object->repairer);
    }

    public function postWrite(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if ((!$object instanceof RepairerExceptionalClosure && !$object instanceof RepairerOpeningHours && !$object instanceof Appointment) || Request::METHOD_DELETE === $method) {
            return;
        }

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($object->repairer, true);
    }

    public function preUpdateAppointment(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof Appointment || Request::METHOD_PUT !== $method) {
            return;
        }

        $originalEntityData = $this->entityManager->getUnitOfWork()->getOriginalEntityData($object);

        if ((true !== $originalEntityData['accepted'] && $object->accepted) || $originalEntityData['slotTime'] !== $object->slotTime) {
            $this->entityManager->persist($object);
            $this->entityManager->flush();
            $this->firstSlotAvailableCalculator->setFirstSlotAvailable($object->repairer);
        }
    }

    public function preUpdateRepairer(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof Repairer || Request::METHOD_PUT !== $method) {
            return;
        }

        $originalEntityData = $this->entityManager->getUnitOfWork()->getOriginalEntityData($object);

        if ($originalEntityData['durationSlot'] !== $object->durationSlot || $originalEntityData['numberOfSlots'] !== $object->numberOfSlots) {
            $this->entityManager->persist($object);
            $this->entityManager->flush();
            $this->firstSlotAvailableCalculator->setFirstSlotAvailable($object);
        }
    }
}
