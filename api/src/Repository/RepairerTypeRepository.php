<?php

namespace App\Repository;

use App\Entity\RepairerType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<RepairerType>
 *
 * @method RepairerType|null find($id, $lockMode = null, $lockVersion = null)
 * @method RepairerType|null findOneBy(array $criteria, array $orderBy = null)
 * @method RepairerType[]    findAll()
 * @method RepairerType[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class RepairerTypeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RepairerType::class);
    }

    public function save(RepairerType $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(RepairerType $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}
