<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\RepairerOpeningHoursRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RepairerOpeningHoursRepository::class)]
#[ApiResource(
    denormalizationContext: ['groups' => [self::WRITE]],
    normalizationContext: ['groups' => [self::READ]],
)]
#[Get]
#[GetCollection]
#[Post(security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')")]
#[Delete(security: "is_granted('ROLE_ADMIN') or (object.repairer.owner == user)")]
class RepairerOpeningHours
{
    public const WRITE = 'repairer_availability_write';
    public const READ = 'repairer_availability_read';

    public const DAYS_OF_WEEK = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

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
    public ?string $day = null;

    #[Assert\Regex("/^([01]?[0-9]|2[0-3]):([03]0)$/")]
    #[ORM\Column]
    #[Groups([self::READ, self::WRITE])]
    public ?string $startTime = null;

    #[Assert\Regex("/^([01]?[0-9]|2[0-3]):([03]0)$/")]
    #[ORM\Column]
    #[Groups([self::READ, self::WRITE])]
    public ?string $endTime = null;
}
