<?php

declare(strict_types=1);

namespace App\Intervention\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Intervention;
use App\Entity\RepairerIntervention;
use App\Entity\User;
use App\Intervention\Dto\CreateInterventionRepairerDto;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Finder\Exception\AccessDeniedException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @template-implements ProcessorInterface<int>
 */
final readonly class CreateInterventionWithCurrentRepairerProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $entityManager,
        private TranslatorInterface $translator
    ) {
    }

    /**
     * @param CreateInterventionRepairerDto $data
     */
    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Intervention
    {
        /** @var ?User $user */
        $user = $this->security->getUser();
        if (!$user) {
            throw new AccessDeniedException($this->translator->trans('403_access.denied.logged', domain: 'validators'));
        }

        $intervention = new Intervention();
        $intervention->description = $data->description;
        $intervention->isAdmin = $user->isAdmin();

        if ($user->isBoss()) {
            if (null === $data->price) {
                throw new BadRequestHttpException($this->translator->trans('400_badRequest.intervention.price', domain: 'validators'));
            }
            if (null === $user->repairer) {
                throw new BadRequestHttpException($this->translator->trans('400_badRequest.repairer.create.intervention', domain: 'validators'));
            }
            $repairerIntervention = new RepairerIntervention();
            $repairerIntervention->price = $data->price;
            $repairerIntervention->repairer = $user->repairer;
            $repairerIntervention->intervention = $intervention;
            $intervention->addRepairerIntervention($repairerIntervention);
        }

        $this->entityManager->persist($intervention);
        $this->entityManager->flush();

        return $intervention;
    }
}
