<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Discussion;
use App\Entity\DiscussionMessage;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class DiscussionMessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, DiscussionMessage::class);
    }

    public function save(DiscussionMessage $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(DiscussionMessage $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function setReadByDiscussionAndUser(Discussion $discussion, User $user): void
    {
        $this->createQueryBuilder('dm')
            ->update()
            ->set('dm.alreadyRead', ':alreadyRead')
            ->setParameter('alreadyRead', true)
            ->where('dm.discussion = :discussion')
            ->andWhere('dm.sender != :user')
            ->setParameter('discussion', $discussion)
            ->setParameter('user', $user)
            ->getQuery()
            ->execute()
        ;
    }

    public function getNumberOfMessageNotReadForDiscussion(int $id, User $user): int
    {
        return $this->createQueryBuilder('dm')
            ->select('COUNT(dm)')
            ->where('dm.discussion = :id')
            ->andWhere('dm.sender != :user')
            ->andWhere('dm.alreadyRead = :alreadyRead')
            ->setParameter('id', $id)
            ->setParameter('user', $user)
            ->setParameter('alreadyRead', false)
            ->getQuery()
            ->getSingleScalarResult();
    }

    public function getNumberOfMessageNotReadByDiscussion(User $user): array
    {
        return $this->createQueryBuilder('dm')
            ->select('d.id as discussion_id, COUNT(dm) as not_read')
            ->innerJoin('dm.discussion', 'd')
            ->where('dm.sender != :user')
            ->andWhere('dm.alreadyRead = :alreadyRead')
            ->setParameter('user', $user)
            ->setParameter('alreadyRead', false)
            ->groupBy('d.id')
            ->getQuery()
            ->getResult();
    }
}
