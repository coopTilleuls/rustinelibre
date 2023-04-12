<?php

declare(strict_types=1);

namespace App\Employees\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Validator\ValidatorInterface;
use App\Employees\Dto\CreateUserEmployeeDto;
use App\Entity\RepairerEmployee;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

final class CreateUserEmployeeProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $persistProcessor,
        private readonly ValidatorInterface $validator,
        private readonly Security $security,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    /**
     * @param CreateUserEmployeeDto $data
     */
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $user = new User();
        $user->setFirstName($data->firstName);
        $user->setLastName($data->lastName);
        $user->setPlainPassword($data->plainPassword);
        $user->setEmail($data->email);
        $user->setEmailConfirmed(true);
        $user->setRoles(['ROLE_EMPLOYEE']);
        // Validate the new entity
        $this->validator->validate($user);

        // Get current user
        /** @var User $currentUser */
        $currentUser = $this->security->getUser();

        // Create a new employee
        $repairerEmployee = new RepairerEmployee();
        $repairerEmployee->setEmployee($user);

        // If the current user is not an admin, inject automatically its repairer shop
        if ($currentUser->isAdmin()) {
            $repairerEmployee->setRepairer($data->repairer);
        } else {
            $currentRepairer = $currentUser->getRepairer();
            if (!$currentRepairer) {
                throw new BadRequestHttpException('You cannot add en employee if you dont have any repairer shop');
            }

            $repairerEmployee->setRepairer($currentRepairer);
        }

        // Validate the new entity
        $this->validator->validate($repairerEmployee);

        // Persist and flush
        $this->entityManager->persist($repairerEmployee);
        $this->entityManager->flush();

        $data->user = $user;
        $this->persistProcessor->process($data, $operation);

        return $repairerEmployee;
    }
}
