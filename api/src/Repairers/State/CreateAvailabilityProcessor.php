<?php

declare(strict_types=1);

namespace App\Repairers\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Validator\ValidatorInterface;
use App\Entity\RepairerAvailability;
use App\Entity\User;
use App\Repairers\Dto\CreateAvailabilityDto;
use App\Repairers\Dto\CreateUserRepairerDto;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class CreateAvailabilityProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly Security $security,
        private readonly ValidatorInterface $validator,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    /**
     * @param CreateAvailabilityDto $data
     */
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        /** @var User $currentUser */
        $currentUser = $this->security->getUser();

        if (!$currentUser->repairer) {
            throw new AccessDeniedHttpException('You don\'t manage any repairer shop');
        }

        if ($data->repairer !== $currentUser->repairer) {
            throw new AccessDeniedHttpException('This repairer shop is not yours');
        }

        if (!in_array($data->day, RepairerAvailability::DAYS_OF_WEEK)) {
            throw new BadRequestHttpException(sprintf('The day provided is not supported, should be one of : %s', implode(',', RepairerAvailability::DAYS_OF_WEEK)));
        }


        $repairerAvailability = new RepairerAvailability();
        $repairerAvailability->repairer = $data->repairer;
        $repairerAvailability->day = $data->day;
        $repairerAvailability->startTime = $data->startTime;
        $repairerAvailability->endTime = $data->endTime;


        // Validate the new entity
        $this->validator->validate($repairerAvailability);

        // Persist and flush
        $this->entityManager->persist($repairerAvailability);
        $this->entityManager->flush();

        return $repairerAvailability;
    }
}
