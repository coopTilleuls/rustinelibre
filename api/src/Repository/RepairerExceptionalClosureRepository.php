<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Repairer;
use App\Entity\RepairerExceptionalClosure;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class RepairerExceptionalClosureRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RepairerExceptionalClosure::class);
    }

    public function save(RepairerExceptionalClosure $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(RepairerExceptionalClosure $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findExceptionalClosureByRepairerBetweenDates(Repairer $repairer, ?\DateTimeInterface $from = new \DateTime(), ?\DateTimeInterface $to = null)
    {
        if (!$to) {
            $to = new \DateTime();
            $to->add(new \DateInterval('P60D'));
        }

        return $this->createQueryBuilder('re')
            ->andWhere('re.startDate >= :from AND re.startDate <= :to')
            ->orWhere('re.endDate >= :from')
            ->andWhere('re.repairer = :repairer')
            ->setParameter('repairer', $repairer->id)
            ->setParameter('from', $from)
            ->setParameter('to', $to)
            ->getQuery()
            ->getResult();
    }
}
