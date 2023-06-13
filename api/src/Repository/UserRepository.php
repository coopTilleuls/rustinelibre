<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Repairer;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 *
 * @method User|null find($id, $lockMode = null, $lockVersion = null)
 * @method User|null findOneBy(array $criteria, array $orderBy = null)
 * @method User[]    findAll()
 * @method User[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function save(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(User $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', \get_class($user)));
        }

        $user->password = $newHashedPassword;

        $this->save($user, true);
    }

    public function getUserWithoutRepairer(): ?User
    {
        return $this->createQueryBuilder('u')
            ->leftJoin('u.repairer', 'r')
            ->where('r.id IS NULL')
            ->andWhere('CAST(u.roles AS TEXT) LIKE :role')
            ->setParameter('role', '%ROLE_USER%')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getUserWithRole(string $role): ?User
    {
        return $this->createQueryBuilder('u')
            ->andWhere('CAST(u.roles AS TEXT) LIKE :role')
            ->setParameter('role', sprintf('%%%s%%', $role))
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }

    public function getUsersInQbIdsByRepairer(QueryBuilder $idsQb, Repairer $repairer)
    {
        $queryBuilder = $this->createQueryBuilder('u');
        $queryBuilder
            ->where($queryBuilder->expr()->in('u.id', $idsQb->getDQL()))
            ->setParameter('repairer', $repairer)
        ;

        return $queryBuilder;
    }
}
