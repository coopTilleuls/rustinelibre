<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Repository\RepairerInterventionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RepairerInterventionRepository::class)]
#[ApiResource(
    denormalizationContext: ['groups' => [self::WRITE]],
)]
#[Post(
    security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')",
)]
class RepairerIntervention
{
    public const WRITE = 'repairer_intervention_write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    public ?int $id = null;

    #[Assert\Positive, Assert\NotNull]
    #[ORM\Column]
    #[Groups([Intervention::READ, self::WRITE])]
    public int $price;

    #[ORM\ManyToOne(cascade: ['persist'], inversedBy: 'repairerInterventions')]
    #[Groups([Intervention::READ])]
    #[ORM\JoinColumn]
    public Repairer $repairer;

    #[Assert\NotNull]
    #[ORM\ManyToOne(inversedBy: 'repairerInterventions')]
    #[ORM\JoinColumn]
    #[Groups([self::WRITE])]
    public Intervention $intervention;
}
