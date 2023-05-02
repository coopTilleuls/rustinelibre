<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\AppointmentRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: AppointmentRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('IS_AUTHENTICATED_FULLY')" // @todo add voter
        ),
        new GetCollection(
            security: "is_granted('IS_AUTHENTICATED_FULLY')" // @todo add voter
        ),
        new Post(
            security: "is_granted('IS_AUTHENTICATED_FULLY')"
        ),
        new Patch(
            security: "is_granted('IS_AUTHENTICATED_FULLY')" // @todo add voter
        ),
        new Put(
            security: "is_granted('IS_AUTHENTICATED_FULLY')" // @todo add voter
        ),
        new Delete(
            security: "is_granted('IS_AUTHENTICATED_FULLY')" // @todo add voter
        ),
    ],
    normalizationContext: ['groups' => [self::APPOINTMENT_READ]],
    denormalizationContext: ['groups' => [self::APPOINTMENT_WRITE]],
)]
class Appointment
{
    public const APPOINTMENT_READ = 'appointment_read';
    public const APPOINTMENT_WRITE = 'appointment_write';

    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::APPOINTMENT_READ])]
    public ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    #[Groups([self::APPOINTMENT_READ, self::APPOINTMENT_WRITE])]
    public ?User $customer = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::APPOINTMENT_READ, self::APPOINTMENT_WRITE])]
    public ?Repairer $repairer = null;

    #[ORM\OneToOne(mappedBy: 'appointment', cascade: ['persist', 'remove'])]
    #[Groups([self::APPOINTMENT_READ, self::APPOINTMENT_WRITE])]
    public ?AutoDiagnostic $autoDiagnostic = null;

    #[ORM\Column]
    #[Groups([self::APPOINTMENT_READ, self::APPOINTMENT_WRITE])]
    public ?\DateTimeImmutable $slotTime = null;

    #[ORM\Column(nullable: true)]
    public ?int $duration = 60;

    #[ORM\Column]
    public bool $accepted = false;
}
