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
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @template-implements ProcessorInterface<int>
 */
final class CreateUserEmployeeProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly ValidatorInterface $validator,
        private readonly Security $security,
        private readonly EntityManagerInterface $entityManager,
        private readonly TranslatorInterface $translator
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
        $user->roles = [User::ROLE_EMPLOYEE];
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
                throw new BadRequestHttpException($this->translator->trans('400_badRequest.add.employee', domain: 'validators'));
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
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $randomPassword = '';

        $randomPassword .= chr(rand(65, 90));
        $randomPassword .= chr(rand(97, 122));
        $randomPassword .= rand(0, 9);

        for ($i = 0; $i < 12 - 3; ++$i) {
            $randomPassword .= $characters[rand(0, strlen($characters) - 1)];
        }

        $randomPassword = str_shuffle($randomPassword);

        return sprintf('%s!', $randomPassword);
    }
}
