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
            throw new BadRequestHttpException('test1');
        }

        /** @var Repairer|null $repairer */
        $repairer = $this->repairerRepository->find($uriVariables['id']);
        if (!$repairer) {
            throw new NotFoundHttpException($this->translator->trans('404_notFound.repairer.employee', domain: 'validators'));
        }

        /** @var User $currentBoss */
        $currentBoss = $this->security->getUser();

        if (!$currentBoss == $repairer->owner) {
            throw new BadRequestHttpException('testboss');
        }
        $newBoss = $data->newBoss;

        $employeeExist = $this->repairerEmployeeRepository->findOneBy(['repairer' => $repairer, 'employee' => $newBoss]);
        if (!$employeeExist) {
            throw new BadRequestHttpException('testEmployee');
        }

        $repairer->owner = $newBoss;
        $this->validator->validate($repairer);

        $newBoss->roles = [User::ROLE_BOSS];
        $this->entityManager->remove($employeeExist);

        $currentBoss->roles = [User::ROLE_EMPLOYEE];
        $repairerEmployee = $this->createNewEmployeeForOldBoss($currentBoss, $repairer);

        $this->entityManager->flush();

        return $repairerEmployee;
    }

    private function createNewEmployeeForOldBoss(User $employee, Repairer $repairer): RepairerEmployee
    {
        $repairerEmployee = new RepairerEmployee();
        $repairerEmployee->repairer = $repairer;
        $repairerEmployee->employee = $employee;
        $this->validator->validate($repairerEmployee);
        $this->entityManager->persist($repairerEmployee);

        return $repairerEmployee;
    }
}
