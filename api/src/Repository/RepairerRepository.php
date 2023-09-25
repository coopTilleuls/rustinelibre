<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Repairer;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class RepairerRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Repairer::class);
    }

    public function save(Repairer $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(Repairer $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function calculateDistanceBetweenRepairerAndCoordinates(Repairer $repairer, string $latitude, string $longitude): int
    {
        $queryBuilder = $this->createQueryBuilder('r');
        $queryBuilder->select('ST_DistanceSphere(:gpsPoint, ST_SetSRID(ST_MakePoint(:latitude, :longitude), 4326)) as distance');
        $queryBuilder->setMaxResults(1);
        $queryBuilder->setParameter('gpsPoint', $repairer->gpsPoint);
        $queryBuilder->setParameter('latitude', $latitude);
        $queryBuilder->setParameter('longitude', $longitude);

        return (int) $queryBuilder->getQuery()->getSingleScalarResult();
    }

    public function getRepairerIdWithMultipleCustomerAppointments(): Repairer
    {
        $subquery = $this->createQueryBuilder('r2')
            ->from('App\Entity\Appointment', 'a2')
            ->leftJoin('a2.repairer', 'ar2')
            ->select('ar2.id')
            ->groupBy('ar2.id')
            ->having('COUNT(DISTINCT a2.customer) > 1')
            ->getQuery()
            ->getResult();

        return $this->createQueryBuilder('r')
            ->select('r')
            ->where('r.id IN (:repairers)')
            ->setParameter('repairers', $subquery)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function findByOldFirstSlotAvailable(): array
    {
        return $this->createQueryBuilder('r')
            ->where('r.firstSlotAvailable < :date')
            ->setParameter('date', new \DateTime('+30 minutes'))
            ->getQuery()
            ->getResult();
    }

    public function findRepairersInIds(array $ids): array
    {
        return $this->createQueryBuilder('r')
            ->where('r.id IN (:repairersIds)')
            ->setParameter('repairersIds', $ids)
            ->getQuery()
            ->getResult();
    }

    /**
     * @return array<int, array>
     */
    public function getAllIdsAndSlugs(): array
    {
        return $this->createQueryBuilder('r')
            ->select('r.id', 'r.slug')
            ->getQuery()
            ->getArrayResult();
    }
}
