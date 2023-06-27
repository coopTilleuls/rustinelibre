<?php

declare(strict_types=1);

namespace App\Appointments\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use App\Entity\Appointment;
use App\Entity\User;
use App\Repository\AppointmentRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\KernelEvents;

readonly class InjectCustomerEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private Security $security, private AppointmentRepository $appointmentRepository)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['injectCustomer', EventPriorities::PRE_WRITE],
        ];
    }

    public function injectCustomer(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        /** @var User $currentUser */
        $currentUser = $this->security->getUser();

        if (!$object instanceof Appointment || Request::METHOD_POST !== $method) {
            return;
        }

        // If no customer provided, inject it
        if (!$object->customer) {
            $object->customer = $currentUser;

            return;
        }

        // If admin or current user = customer, do nothing
        if ($this->security->isGranted(User::ROLE_ADMIN) || $object->customer === $currentUser) {
            return;
        }

        // If boss/employee, check customer relationship
        if (($this->security->isGranted(User::ROLE_BOSS) || $this->security->isGranted(User::ROLE_EMPLOYEE)) && $object->customer !== $currentUser) {
            $checkAppointment = $this->appointmentRepository->findOneBy([
                'customer' => $object->customer,
                'repairer' => $currentUser->repairerEmployee->repairer ?? $currentUser->repairer,
            ]);

            if ($checkAppointment) {
                return;
            }
        }

        throw new AccessDeniedHttpException('access.denied.customer');
    }
}
