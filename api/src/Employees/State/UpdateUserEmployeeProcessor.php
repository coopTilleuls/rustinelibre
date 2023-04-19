<?php

declare(strict_types=1);

namespace App\Employees\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Validator\ValidatorInterface;
use App\Employees\Dto\CreateUserEmployeeDto;
use App\Entity\RepairerEmployee;
use App\Entity\User;
use App\Repository\RepairerEmployeeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

final class UpdateUserEmployeeProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly RepairerEmployeeRepository $repairerEmployeeRepository,
        private readonly ValidatorInterface $validator,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    /**
     * @param CreateUserEmployeeDto $data
     */
    public function process($data, Operation $operation, array $uriVariables = [], array $context = []): RepairerEmployee
    {
        if (!array_key_exists('id', $uriVariables)) {
            throw new BadRequestHttpException('You should provide a repairer employee ID to update it');
        }

        $repairerEmployee = $this->repairerEmployeeRepository->find($uriVariables['id']);
        if (!$repairerEmployee) {
            throw new NotFoundHttpException('this repairer employee does not exist');
        }

        $repairerEmployee->setEnabled(boolval($data->enabled));
        $this->validator->validate($repairerEmployee);

        /** @var User $user */
        $user = $repairerEmployee->getEmployee();

        foreach (['firstName', 'lastName', 'email', 'plainPassword'] as $property) {
            if (!empty($data->$property)) {
                $user->$property = $data->$property;
            }
        }

        $this->validator->validate($user);
        $this->entityManager->flush();

        return $repairerEmployee;
    }
}
