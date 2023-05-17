<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
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
use App\Repository\AppointmentRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AppointmentRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::APPOINTMENT_READ]],
    denormalizationContext: ['groups' => [self::APPOINTMENT_WRITE]],
    paginationClientEnabled: true,
)]
#[ApiFilter(SearchFilter::class, properties: ['customer' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['id'], arguments: ['orderParameterName' => 'order'])]
#[Get(security: "is_granted('ROLE_ADMIN') or object.customer == user or object.repairer.owner == user")]
#[GetCollection(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Post(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Put(security: "is_granted('ROLE_ADMIN') or object.customer == user or object.repairer.owner == user")]
#[Delete(security: "is_granted('ROLE_ADMIN') or object.customer == user or object.repairer.owner == user")]
#[ApiFilter(DateFilter::class, properties: ['slotTime'])]
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
    #[Groups([self::APPOINTMENT_READ])]
    public User $customer;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::APPOINTMENT_READ, self::APPOINTMENT_WRITE])]
    #[Assert\NotNull, Assert\NotBlank]
    public Repairer $repairer;

    #[ORM\OneToOne(mappedBy: 'appointment', cascade: ['persist', 'remove'])]
    #[Groups([self::APPOINTMENT_READ, self::APPOINTMENT_WRITE])]
    public ?AutoDiagnostic $autoDiagnostic = null;

    #[ORM\Column]
    #[Groups([self::APPOINTMENT_READ, self::APPOINTMENT_WRITE])]
    #[Assert\NotNull, Assert\NotBlank, Assert\GreaterThan('now')]
    public ?\DateTimeImmutable $slotTime = null;

    #[ORM\Column(nullable: true)]
    #[Groups([self::APPOINTMENT_READ, self::APPOINTMENT_WRITE])]
    #[ApiProperty(securityPostDenormalize: "is_granted('ACCEPTED_TOGGLE', object)")]
    public ?bool $accepted = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[Groups([self::APPOINTMENT_READ, self::APPOINTMENT_WRITE])]
    public ?Bike $bike = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[Groups([self::APPOINTMENT_READ, self::APPOINTMENT_WRITE])]
    public ?BikeType $bikeType = null;
}
