<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Appointment;
use App\Entity\Repairer;
use App\Entity\RepairerExceptionalClosure;
use App\Entity\RepairerOpeningHours;
use App\Repairers\Slots\ComputeAvailableSlotsByRepairer;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use App\Repository\AppointmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class SlotsAvailableEventSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private FirstSlotAvailableCalculator $firstSlotAvailableCalculator,
        private ComputeAvailableSlotsByRepairer $computeAvailableSlotsByRepairer,
        private AppointmentRepository $appointmentRepository,
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => [
                ['preRemove', EventPriorities::PRE_WRITE], // Before remove an opening hours, exceptional closure, appointment
                ['postWrite', EventPriorities::POST_WRITE], // Before create an opening hours, exceptional closure
                ['preWriteAppointment', EventPriorities::PRE_WRITE],
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

        if ((!$object instanceof RepairerExceptionalClosure && !$object instanceof RepairerOpeningHours) || Request::METHOD_DELETE === $method) {
            return;
        }

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($object->repairer, true);
    }

    public function preWriteAppointment(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof Appointment || Request::METHOD_POST !== $method) {
            return;
        }

        $slotsAvailable = $this->computeAvailableSlotsByRepairer->buildArrayOfAvailableSlots($object->repairer);

        if (!array_key_exists($object->slotTime->format('Y-m-d'), $slotsAvailable) || !in_array($object->slotTime->format('H:i'), $slotsAvailable[$object->slotTime->format('Y-m-d')], true)) {
            throw new BadRequestHttpException('This slot is not available.');
        }

        $this->entityManager->persist($object);
        $this->entityManager->flush();

        $appointmentsWithRepairerAndSlotTime = $this->appointmentRepository->findBy(['repairer' => $object->repairer, 'slotTime' => $object->slotTime]);

        if (count($appointmentsWithRepairerAndSlotTime) >= $object->repairer->numberOfSlots) {
            unset($slotsAvailable[$object->slotTime->format('Y-m-d')][array_search($object->slotTime->format('H:i'), $slotsAvailable[$object->slotTime->format('Y-m-d')], true)]);
        }

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($object->repairer, true, $slotsAvailable);
    }

    public function preUpdateAppointment(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof Appointment || Request::METHOD_PUT !== $method) {
            return;
        }

        // Get the original RDV to check change
        $originalEntityData = $this->entityManager->getUnitOfWork()->getOriginalEntityData($object);

        // If neither status nor the slot change. Do nothing.
        if ($originalEntityData['status'] !== $object->status || $originalEntityData['slotTime'] !== $object->slotTime) {
            // Get all available slots
            $slotsAvailable = $this->computeAvailableSlotsByRepairer->buildArrayOfAvailableSlots($object->repairer);

            // The slot change, and the new slot is not available
            if ($originalEntityData['slotTime'] !== $object->slotTime && (!array_key_exists($object->slotTime->format('Y-m-d'), $slotsAvailable) || !in_array($object->slotTime->format('H:i'), $slotsAvailable[$object->slotTime->format('Y-m-d')], true))) {
                throw new BadRequestHttpException('This slot is not available.');
            }

            // Flush the RDV now to get infos in database if necessary
            $this->entityManager->persist($object);
            $this->entityManager->flush();

            // Get RDV and count if the maximum slots has been reached
            $appointmentsWithRepairerAndSlotTime = $this->appointmentRepository->findBy(['repairer' => $object->repairer, 'slotTime' => $object->slotTime]);

            if (count($appointmentsWithRepairerAndSlotTime) >= $object->repairer->numberOfSlots) {
                unset($slotsAvailable[$object->slotTime->format('Y-m-d')][array_search($object->slotTime->format('H:i'), $slotsAvailable[$object->slotTime->format('Y-m-d')], true)]);
            }

            $this->firstSlotAvailableCalculator->setFirstSlotAvailable($object->repairer, slotsAvailable: $slotsAvailable);
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
