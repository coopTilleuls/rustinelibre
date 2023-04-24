<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use App\Repository\BikeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BikeRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::REPAIRER_READ]],
    denormalizationContext: ['groups' => [self::REPAIRER_WRITE]]
)]
class Bike
{
    public const REPAIRER_READ = 'bike_read';
    public const REPAIRER_WRITE = 'bike_write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::REPAIRER_READ])]
    public ?int $id = null;

    #[ORM\ManyToOne(cascade: ['persist'], inversedBy: 'bikes')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?User $owner = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?string $brand = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?BikeType $bikeType = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?string $description = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?string $details = null;

    #[ORM\Column(nullable: true)]
    public ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::REPAIRER_READ])]
    public ?MediaObject $picture = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::REPAIRER_READ])]
    public ?MediaObject $wheelPicture = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::REPAIRER_READ])]
    public ?MediaObject $transmissionPicture = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }
}
