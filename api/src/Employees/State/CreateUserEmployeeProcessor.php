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
        private readonly ValidatorInterface $validator,
        private readonly Security $security,
        private readonly EntityManagerInterface $entityManager
    ) {
    }

    /**
     * @param CreateUserEmployeeDto $data
     */
    public function process($data, Operation $operation, array $uriVariables = [], array $context = []): RepairerEmployee
    {
        $user = new User();
        $user->firstName = $data->firstName;
        $user->lastName = $data->lastName;
        $user->plainPassword = $data->plainPassword ?: $this->generateRandomTempPassword();
        $user->email = $data->email;
        $user->emailConfirmed = true;
        $user->roles = ['ROLE_EMPLOYEE'];
        // Validate the new entity
        $this->validator->validate($user);

        // Get current user
        /** @var User $currentUser */
        $currentUser = $this->security->getUser();

        // Create a new employee
        $repairerEmployee = new RepairerEmployee();
        $repairerEmployee->employee = $user;

        // If the current user is not an admin, inject automatically its repairer shop
        if ($currentUser->isAdmin() && !$currentUser->repairer) {
            $repairerEmployee->repairer = $data->repairer;
        } else {
            $currentRepairer = $currentUser->repairer;
            if (!$currentRepairer) {
                throw new BadRequestHttpException('You cannot add en employee if you dont have any repairer shop');
            }

            $repairerEmployee->repairer = $currentRepairer;
        }

        // Validate the new entity
        $this->validator->validate($repairerEmployee);

        // Persist and flush
        $this->entityManager->persist($repairerEmployee);
        $this->entityManager->flush();

        return $repairerEmployee;
    }

    private function generateRandomTempPassword(): string
    {
        $alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=';
        $password = '';
        while (strlen($password) < 12) {
            $bytes = random_bytes(1);
            $char = substr($alphabet, ord($bytes) % strlen($alphabet), 1);

            if (ctype_upper($char)) {
                $hasUppercase = true;
            } elseif (ctype_digit($char)) {
                $hasDigit = true;
            } else {
                $hasSpecial = true;
            }

            $password .= $char;
        }

        if (!isset($hasUppercase) || !isset($hasDigit) || !isset($hasSpecial)) {
            return $this->generateRandomTempPassword();
        }

        return $password;
    }
}
