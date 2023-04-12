<?php

namespace App\Repository;

use App\Entity\RepairerEmployee;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RepairerEmployee>
 *
 * @method RepairerEmployee|null find($id, $lockMode = null, $lockVersion = null)
 * @method RepairerEmployee|null findOneBy(array $criteria, array $orderBy = null)
 * @method RepairerEmployee[]    findAll()
 * @method RepairerEmployee[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RepairerEmployeeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RepairerEmployee::class);
    }

    public function save(RepairerEmployee $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(RepairerEmployee $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
