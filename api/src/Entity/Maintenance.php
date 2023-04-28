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
use ApiPlatform\Metadata\Put;
use App\Repository\MaintenanceRepository;
use App\Validator as BikeAssert;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MaintenanceRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::READ]],
    denormalizationContext: ['groups' => [self::WRITE]]
)]
#[Get(security: "is_granted('ROLE_ADMIN') or (object.bike.owner == user)")]
#[GetCollection(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Post(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Put(security: "is_granted('ROLE_ADMIN') or object.bike.owner == user")]
#[Delete(security: "is_granted('ROLE_ADMIN') or object.bike.owner == user")]
#[ApiFilter(SearchFilter::class, properties: ['bike' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'repairDate'], arguments: ['orderParameterName' => 'order'])]
class Maintenance
{
    public const READ = 'maintenance_read';
    public const WRITE = 'maintenance_write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::READ])]
    public ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[BikeAssert\BikeOwner]
    #[Groups([self::READ, self::WRITE])]
    public ?Bike $bike = null;

    #[ORM\Column(length: 255)]
    #[Groups([self::READ, self::WRITE])]
    public ?string $name = null;

    #[ORM\Column(length: 3000, nullable: true)]
    #[Groups([self::READ, self::WRITE])]
    public ?string $description = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::READ, self::WRITE])]
    public ?MediaObject $photo = null;

    #[ORM\Column(nullable: true)]
    #[Groups([self::READ, self::WRITE])]
    public ?\DateTimeImmutable $repairDate = null;
}
