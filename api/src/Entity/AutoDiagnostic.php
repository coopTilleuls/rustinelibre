<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
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

#[ORM\Entity(repositoryClass: AutoDiagnosticRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::READ]],
    denormalizationContext: ['groups' => [self::WRITE]],
    extraProperties: [
        'standard_put',
    ]
)]
#[Get(security: "is_granted('ROLE_ADMIN') or object.appointment.customer == user or object.appointment.repairer.owner == user")]
#[GetCollection(security: "is_granted('ROLE_ADMIN')")]
#[Post(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Put(security: "is_granted('ROLE_ADMIN') or object.appointment.customer == user")]
#[Delete(security: "is_granted('ROLE_ADMIN') or object.appointment.customer == user")]
#[ApiFilter(SearchFilter::class, properties: ['appointment' => 'exact'])]
class AutoDiagnostic
{
    public const READ = 'autodiag_read';
    public const WRITE = 'autodiag_write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::READ])]
    public ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'autoDiagnostic')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::READ, self::WRITE])]
    #[AutoDiagAssert\AutoDiagnosticAppointment]
    public ?Appointment $appointment = null;

    #[ORM\Column(length: 255)]
    #[Groups([self::READ, self::WRITE, Appointment::APPOINTMENT_READ])]
    public ?string $prestation = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class, cascade: ['remove'])]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::READ, self::WRITE, Appointment::APPOINTMENT_READ])]
    public ?MediaObject $photo = null;
}
