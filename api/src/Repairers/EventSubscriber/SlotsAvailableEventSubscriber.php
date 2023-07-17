<?php

declare(strict_types=1);

namespace App\Repairers\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Appointment;
use App\Entity\Repairer;
use App\Entity\RepairerExceptionalClosure;
use App\Entity\RepairerOpeningHours;
use App\Entity\User;
use App\Repairers\Slots\ComputeAvailableSlotsByRepairer;
use App\Repairers\Slots\FirstSlotAvailableCalculator;
use App\Repository\AppointmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Contracts\Translation\TranslatorInterface;

readonly class SlotsAvailableEventSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private FirstSlotAvailableCalculator $firstSlotAvailableCalculator,
        private ComputeAvailableSlotsByRepairer $computeAvailableSlotsByRepairer,
        private AppointmentRepository $appointmentRepository,
        private Security $security,
        private TranslatorInterface $translator
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
        /** @var User $currentUser */
        $currentUser = $this->security->getUser();

        // I am simple cyclist
        if (!$currentUser->isBoss() && !$currentUser->isEmployee()) {
            // If slot is not available
            if (!array_key_exists($object->slotTime->format('Y-m-d'), $slotsAvailable) || !in_array($object->slotTime->format('H:i'), $slotsAvailable[$object->slotTime->format('Y-m-d')], true)) {
                throw new BadRequestHttpException($this->translator->trans('400_badRequest.slot.not.available', domain: 'validators'));
            }

            $this->persistAppointment($object, $slotsAvailable);

            return;
        }

        // Current user does not have any shop
        $curentRepairer = $currentUser->repairer ?: ($currentUser->repairerEmployee?->repairer);
        if (!$curentRepairer) {
            throw new AccessDeniedHttpException($this->translator->trans('403_access.denied.repairer.belong.shop', domain: 'validators'));
        }

        // This shop is not mine
        if ($curentRepairer !== $object->repairer) {
            throw new AccessDeniedHttpException($this->translator->trans('403_access.denied.repairer.shop.owner', domain: 'validators'));
        }

        $object->status = 'validated';
        $this->persistAppointment($object, $slotsAvailable);
    }

    private function persistAppointment(Appointment $appointment, array $slotsAvailable): void
    {
        $this->entityManager->persist($appointment);
        $this->entityManager->flush();

        $appointmentsWithRepairerAndSlotTime = $this->appointmentRepository->findBy(['repairer' => $appointment->repairer, 'slotTime' => $appointment->slotTime]);

        if (count($appointmentsWithRepairerAndSlotTime) >= $appointment->repairer->numberOfSlots) {
            if (array_key_exists($appointment->slotTime->format('Y-m-d'), $slotsAvailable) && false !== array_search($appointment->slotTime->format('H:i'), $slotsAvailable[$appointment->slotTime->format('Y-m-d')], true)) {
                unset($slotsAvailable[$appointment->slotTime->format('Y-m-d')][array_search($appointment->slotTime->format('H:i'), $slotsAvailable[$appointment->slotTime->format('Y-m-d')], true)]);
            }
        }

        $this->firstSlotAvailableCalculator->setFirstSlotAvailable($appointment->repairer, true, $slotsAvailable);
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
                throw new BadRequestHttpException($this->translator->trans('400_badRequest.slot.not.available', domain: 'validators'));
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
