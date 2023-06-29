<?php

declare(strict_types=1);

namespace App\RepairerIntervention\EventSubscriber;

use ApiPlatform\Symfony\EventListener\EventPriorities;
use ApiPlatform\Validator\ValidatorInterface;
use App\Entity\Intervention;
use App\Entity\RepairerIntervention;
use App\Entity\User;
use App\Repository\InterventionRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use Symfony\Component\HttpKernel\KernelEvents;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Symfony\Contracts\Translation\TranslatorInterface;

readonly class RepairerInterventionEventSubscriber implements EventSubscriberInterface
{
    public function __construct(
        private InterventionRepository $interventionRepository,
        private Security $security,
        private ValidatorInterface $validator,
        private TranslatorInterface $translator
    ) {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::VIEW => ['linkRepairerToAdminIntervention', EventPriorities::PRE_WRITE],
        ];
    }

    public function linkRepairerToAdminIntervention(ViewEvent $event): void
    {
        $object = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if (!$object instanceof RepairerIntervention || !in_array($method, [Request::METHOD_POST, Request::METHOD_PUT], true)) {
            return;
        }

        /** @var ?User $user */
        $user = $this->security->getUser();

        if (!$user) {
            throw new UnauthorizedHttpException('Bearer realm="link repairer to intervention"');
        }

        if (null === $user->repairer) {
            throw new AccessDeniedException($this->translator->trans('403_access.denied.repairer.intervention.link', domain: 'validators'));
        }

        /** @var ?Intervention $adminIntervention */
        $adminIntervention = $this->interventionRepository->findOneBy(['id' => $object->intervention->id]);

        if (null === $adminIntervention) {
            throw new NotFoundHttpException($this->translator->trans('404_notFound.intervention', ['%id%' => $object->intervention->id], domain: 'validators'));
        }

        if (!$adminIntervention->isAdmin) {
            throw new AccessDeniedException($this->translator->trans('403_access.denied.admin.intervention.link', domain: 'validators'));
        }

        $object->repairer = $user->repairer;
        $this->validator->validate($object);
    }
}
