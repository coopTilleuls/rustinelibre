<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\Repairers\Dto\CreateAvailabilityDto;
use App\Repairers\Dto\CreateUserRepairerDto;
use App\Repairers\State\CreateAvailabilityProcessor;
use App\Repairers\State\CreateUserRepairerProcessor;
use App\Repository\RepairerAvailabilityRepository;
use Doctrine\ORM\Mapping as ORM;
use App\Validator as AppAssert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use ApiPlatform\OpenApi\Model;
use Symfony\Component\Validator\Constraints as Assert;


#[ORM\Entity(repositoryClass: RepairerAvailabilityRepository::class)]
#[ApiResource(
    denormalizationContext: ['groups' => [self::WRITE]],
)]
#[Post(
    security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')",
)]
#[Post(
    uriTemplate: '/create_repairer_availability',
    openapi: new Model\Operation(
        summary: 'Create repairer availability',
        description: 'Create repairer availability'),
    denormalizationContext: ['groups' => [self::WRITE]],
    input: CreateAvailabilityDto::class,
    processor: CreateAvailabilityProcessor::class,
    security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')",
)]
class RepairerAvailability
{
    public const WRITE = 'repairer_availability_write';
    public const DAYS_OF_WEEK = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    public ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    public Repairer $repairer;

    #[ORM\Column]
    public ?string $day = null;

    #[ORM\Column]
    public ?string $startTime = null;

    #[ORM\Column]
    public ?string $endTime = null;
}
