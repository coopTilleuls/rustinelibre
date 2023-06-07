<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\DiscussionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DiscussionRepository::class)]
#[ApiResource]
#[GetCollection(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Get(security: "is_granted('ROLE_ADMIN') or object.customer == user or (user.repairer and user.repairer == object.repairer) 
or (user.repairerEmployee and user.repairerEmployee.repairer == object.repairer)")]
#[Post(security: "is_granted('ROLE_ADMIN') or (user.repairer and user.repairer == object.repairer) 
or (user.repairerEmployee and user.repairerEmployee.repairer == object.repairer)")]
#[Delete(security: "is_granted('ROLE_ADMIN')")]
#[ApiFilter(SearchFilter::class, properties: ['customer' => 'exact', 'repairer' => 'exact'])]
#[ApiFilter(OrderFilter::class)]
class Discussion
{
    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    public ?int $id = null;

    #[Assert\NotNull]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    public ?Repairer $repairer = null;

    #[Assert\NotNull]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    public ?User $customer = null;

    #[ORM\Column(nullable: true)]
    public ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable('now', new \DateTimeZone('Europe/Paris'));
    }
}
