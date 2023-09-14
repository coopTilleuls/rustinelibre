<?php

declare(strict_types=1);

namespace App\Repairers\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Validator\ValidatorInterface;
use App\Entity\Repairer;
use App\Entity\RepairerEmployee;
use App\Entity\User;
use App\Repairers\Dto\UpdateRepairerBossDto;
use App\Repository\RepairerEmployeeRepository;
use App\Repository\RepairerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\File\Exception\AccessDeniedException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Contracts\Translation\TranslatorInterface;

/**
 * @template-implements ProcessorInterface<int>
 */
final readonly class UpdateRepairerBossProcessor implements ProcessorInterface
{
    public function __construct(
        private RepairerRepository $repairerRepository,
        private RepairerEmployeeRepository $repairerEmployeeRepository,
        private ValidatorInterface $validator,
        private EntityManagerInterface $entityManager,
        private TranslatorInterface $translator,
        private Security $security
    ) {
    }

    /**
     * @param UpdateRepairerBossDto $data
     */
    public function process($data, Operation $operation, array $uriVariables = [], array $context = []): RepairerEmployee
    {
        if (!array_key_exists('id', $uriVariables)) {
            throw new BadRequestHttpException('You should provide a repairer ID');
        }

        /** @var Repairer|null $repairer */
        $repairer = $this->repairerRepository->find($uriVariables['id']);
        if (!$repairer) {
            throw new NotFoundHttpException($this->translator->trans('404_notFound.repairer.employee', domain: 'validators'));
        }

        $currentBoss = $repairer->owner;
        // If current user is not the repairer's boss or an admin, avoid the proces.
        if ($currentBoss !== $this->security->getUser() && !$this->security->isGranted(User::ROLE_ADMIN)) {
            throw new AccessDeniedException('You are not the owner');
        }

        $newBoss = $data->newBoss;
        // Check an employee exist with this user and this repairer
        $employeeExist = $this->repairerEmployeeRepository->findOneBy(['repairer' => $repairer, 'employee' => $newBoss]);
        if (!$employeeExist) {
            throw new BadRequestHttpException('The user you provide is not an employee of this repairer');
        }

        // Remove the old employee
        $this->entityManager->remove($employeeExist);
        $this->entityManager->flush();

        // Create the new employee
        $newRepairerEmployee = $this->createNewEmployeeForOldBoss($repairer);

        // Update old boss
        $currentBoss->roles = [User::ROLE_EMPLOYEE];
        $currentBoss->repairer = null;
        $currentBoss->repairerEmployee = $newRepairerEmployee;

        // Set the new roles
        $newBoss->roles = [User::ROLE_BOSS];
        $repairer->owner = $newBoss;
        $this->validator->validate($repairer);
        $newBoss->repairerEmployee = null;

        $this->entityManager->flush();

        return $newRepairerEmployee;
    }

    private function createNewEmployeeForOldBoss(Repairer $repairer): RepairerEmployee
    {
        $repairerEmployee = new RepairerEmployee();
        $repairerEmployee->repairer = $repairer;
        $repairerEmployee->employee = $repairer->owner;
        $this->validator->validate($repairerEmployee);
        $this->entityManager->persist($repairerEmployee);
        $this->entityManager->flush($repairerEmployee);

        return $repairerEmployee;
    }
}
