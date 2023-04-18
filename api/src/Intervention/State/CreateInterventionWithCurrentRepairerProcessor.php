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

final readonly class CreateInterventionWithCurrentRepairerProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $entityManager
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
            throw new AccessDeniedException('You must be logged in to create an intervention');
        }

        $intervention = new Intervention();
        $intervention->description = $data->description;
        $intervention->isAdmin = $user->isAdmin();

        if ($user->isBoss()) {
            if (null === $data->price) {
                throw new BadRequestHttpException('Price is required');
            }
            if (null === $user->repairer) {
                throw new BadRequestHttpException('You must have a repairer to create an intervention');
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
