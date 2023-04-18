<?php

namespace App\Repository;

use App\Entity\RepairerIntervention;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RepairerIntervention>
 *
 * @method RepairerIntervention|null find($id, $lockMode = null, $lockVersion = null)
 * @method RepairerIntervention|null findOneBy(array $criteria, array $orderBy = null)
 * @method RepairerIntervention[]    findAll()
 * @method RepairerIntervention[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RepairerInterventionRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RepairerIntervention::class);
    }

    public function save(RepairerIntervention $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(RepairerIntervention $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
