<?php

declare(strict_types=1);

namespace App\Repairers\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Validator\ValidatorInterface;
use App\Entity\Repairer;
use App\Entity\User;
use App\Repairers\Dto\CreateUserRepairerDto;
use Doctrine\ORM\EntityManagerInterface;

final class CreateUserRepairerProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly ValidatorInterface $validator,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    /**
     * @param CreateUserRepairerDto $data
     */
    public function process($data, Operation $operation, array $uriVariables = [], array $context = [])
    {
        $user = new User();
        $user->setFirstName($data->firstName);
        $user->setLastName($data->lastName);
        $user->setPlainPassword($data->plainPassword);
        $user->setEmail($data->email);
        $user->setRoles(['ROLE_BOSS']);
        // Validate the new entity
        $this->validator->validate($user);

        // Create a new employee
        $repairer = new Repairer();
        $repairer->setOwner($user);
        $repairer->setName($data->name);
        $repairer->setCity($data->city);
        $repairer->setComment($data->comment);
        $repairer->setPostcode($data->postcode);
        $repairer->setStreet($data->street);
        $repairer->setRepairerType($data->repairerType);
        foreach ($data->bikeTypesSupported as $bikeType) {
            $repairer->addBikeTypesSupported($bikeType);
        }

        // Validate the new entity
        $this->validator->validate($repairer);

        // Persist and flush
        $this->entityManager->persist($repairer);
        $this->entityManager->flush();

        return $repairer;
    }
}
