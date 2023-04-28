<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\AutoDiagnostics\Validator as AutoDiagAssert;
use App\Repository\AutoDiagnosticRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AutoDiagnosticRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::READ]],
    denormalizationContext: ['groups' => [self::WRITE]]
)]
#[Get(security: "is_granted('ROLE_ADMIN') or (object.appointment.customer == user) or (object.appointment.repairer.owner == user)")]
#[GetCollection(security: "is_granted('ROLE_ADMIN')")]
#[Post(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Put(security: "is_granted('ROLE_ADMIN') or (object.appointment.customer == user)")]
#[Delete(security: "is_granted('ROLE_ADMIN') or (object.appointment.customer == user)")]
class AutoDiagnostic
{
    public const READ = 'autodiag_read';
    public const WRITE = 'autodiag_write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::READ])]
    public ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups([self::READ, self::WRITE])]
    #[AutoDiagAssert\AutoDiagnosticAppointment]
    // #[Assert\Unique]
    public ?Appointment $appointment = null;

    #[ORM\Column(length: 255)]
    #[Groups([self::READ, self::WRITE])]
    public ?string $prestation = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::READ, self::WRITE])]
    public ?MediaObject $photo = null;
}
