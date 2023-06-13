<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\AutoDiagnostic;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<AutoDiagnostic>
 *
 * @method AutoDiagnostic|null find($id, $lockMode = null, $lockVersion = null)
 * @method AutoDiagnostic|null findOneBy(array $criteria, array $orderBy = null)
 * @method AutoDiagnostic[]    findAll()
 * @method AutoDiagnostic[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class AutoDiagnosticRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, AutoDiagnostic::class);
    }

    public function save(AutoDiagnostic $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(AutoDiagnostic $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
