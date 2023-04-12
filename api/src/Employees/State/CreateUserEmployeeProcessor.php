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

final class CreateUserEmployeeProcessor implements ProcessorInterface
{
    public function __construct(
        private ProcessorInterface $persistProcessor,
        private ValidatorInterface $validator,
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

        $repairerEmployee = new RepairerEmployee();
        $repairerEmployee->setEmployee($user);
        $repairerEmployee->setRepairer($data->repairer);
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