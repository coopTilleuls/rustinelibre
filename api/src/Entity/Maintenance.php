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
use App\Maintenance\Validator\MaintenanceCanWrite;
use App\Repository\MaintenanceRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MaintenanceRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::READ]],
    denormalizationContext: ['groups' => [self::WRITE]],
    paginationClientEnabled: true,
    paginationClientItemsPerPage: true,
)]
#[Get(security: "is_granted('ROLE_ADMIN') or object.bike.owner == user or is_granted('MAINTENANCE_REPAIRER_READ', object)")]
#[GetCollection(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Post(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Put(security: "is_granted('ROLE_ADMIN') or object.bike.owner == user or object.author == user")]
#[Delete(security: "is_granted('ROLE_ADMIN') or object.bike.owner == user")]
#[ApiFilter(SearchFilter::class, properties: ['bike' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['id', 'repairDate'], arguments: ['orderParameterName' => 'order'])]
#[MaintenanceCanWrite]
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
    #[Groups([self::READ, self::WRITE])]
    public ?Bike $bike = null;

    #[ORM\Column(length: 255)]
    #[Groups([self::READ, self::WRITE])]
    public ?string $name = null;

    #[ORM\Column(length: 3000, nullable: true)]
    #[Groups([self::READ, self::WRITE])]
    public ?string $description = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class, cascade: ['remove'])]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::READ, self::WRITE])]
    public ?MediaObject $photo = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class, cascade: ['remove'])]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[ApiProperty(types: ['https://schema.org/image'])] // TODO: quel type pour les fichiers ?
    #[Groups([self::READ, self::WRITE])]
    public ?MediaObject $invoice = null;

    #[ORM\Column(nullable: true)]
    #[Groups([self::READ, self::WRITE])]
    public ?\DateTimeImmutable $repairDate = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[Groups([self::READ])]
    public ?User $author = null;
}
