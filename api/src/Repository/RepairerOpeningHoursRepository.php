<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Repairer;
use App\Entity\RepairerOpeningHours;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class RepairerOpeningHoursRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, RepairerOpeningHours::class);
    }

    public function save(RepairerOpeningHours $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(RepairerOpeningHours $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function findRepairerAvailabilitiesGroupByDay(Repairer $repairer): array
    {
        $availabilities = $this->createQueryBuilder('ra')
            ->select('ra.day, ra.startTime, ra.endTime')
            ->andWhere('ra.repairer = :repairer')
            ->setParameter('repairer', $repairer->id)
            ->groupBy('ra.day')
            ->addGroupBy('ra.startTime')
            ->addGroupBy('ra.endTime')
            ->getQuery()
            ->getResult()
        ;

        $groupAvailabilities = [];
        foreach ($availabilities as $availability) {
            $groupAvailabilities[$availability['day']][] = [
                'startTime' => $availability['startTime'],
                'endTime' => $availability['endTime'],
            ];
        }

        return $groupAvailabilities;
    }
}
