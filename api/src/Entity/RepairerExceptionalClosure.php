<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repairers\Validator\RepairerClosing;
use App\Repository\RepairerExceptionalClosureRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RepairerExceptionalClosureRepository::class)]
#[ApiResource(
    denormalizationContext: ['groups' => [self::WRITE]],
    normalizationContext: ['groups' => [self::READ]],
)]
#[Get]
#[GetCollection]
#[Post(security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')")]
#[Delete(security: "is_granted('ROLE_ADMIN') or (object.repairer.owner == user)")]
#[RepairerClosing]
class RepairerExceptionalClosure
{
    public const READ = 'repairer_exceptional_closure_read';
    public const WRITE = 'repairer_exceptional_closure_write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    public ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[Groups([self::WRITE])]
    public ?Repairer $repairer = null;

    #[ORM\Column]
    #[Groups([self::READ, self::WRITE])]
    public ?\DateTime $startDate = null;

    #[ORM\Column]
    #[Groups([self::READ, self::WRITE])]
    public ?\DateTime $endDate = null;
}
