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
use function PHPUnit\Framework\throwException;

readonly class InjectCustomerEventSubscriber implements EventSubscriberInterface
{
    public function __construct(private Security $security, private readonly AppointmentRepository $appointmentRepository)
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

        if (!$object instanceof Appointment || Request::METHOD_POST !== $method || $this->security->isGranted('ROLE_ADMIN')) {
            return;
        }

        /** @var User $currentUser */
        $currentUser = $this->security->getUser();
        if($this->security->isGranted('ROLE_BOSS') || $this->security->isGranted('ROLE_EMPLOYEE')){
        $checkAppointment = $this->appointmentRepository->findOneBy([
            'customer' => $object->customer->id,
            'repairer' => $currentUser->repairerEmployee->repairer ?? $currentUser->repairer,
        ]);
            if(!$checkAppointment) {
                throw new AccessDeniedHttpException('Cet utilisateur n\'est pas un de vos client');
            }
        }
        $object->customer = $currentUser;
    }
}
