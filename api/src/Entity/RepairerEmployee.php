<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Employees\Dto\CreateUserEmployeeDto;
use App\Employees\State\CreateUserEmployeeProcessor;
use App\Repository\RepairerEmployeeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RepairerEmployeeRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::EMPLOYEE_READ]],
    denormalizationContext: ['groups' => [self::EMPLOYEE_WRITE]]
)]
#[Get(security: "is_granted('ROLE_ADMIN') or object.repairer == user.repairer")]
#[GetCollection(security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')")]
#[Post(
    security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')",
    input: CreateUserEmployeeDto::class,
    processor: CreateUserEmployeeProcessor::class
)]
#[Put(security: "is_granted('ROLE_ADMIN') or object.repairer == user.repairer")]
#[Delete(security: "is_granted('IS_AUTHENTICATED_FULLY') and (is_granted('ROLE_ADMIN') or object.repairer == user.repairer)")]
class RepairerEmployee
{
    public const EMPLOYEE_READ = 'employee_read';
    public const EMPLOYEE_WRITE = 'employee_write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::EMPLOYEE_READ])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'repairerEmployees')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::EMPLOYEE_READ, self::EMPLOYEE_WRITE])]
    public ?Repairer $repairer = null;

    #[ORM\OneToOne(inversedBy: 'repairerEmployee', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::EMPLOYEE_READ, self::EMPLOYEE_WRITE])]
    private ?User $employee = null;

    #[ORM\Column]
    #[Groups([self::EMPLOYEE_READ, self::EMPLOYEE_WRITE])]
    private ?bool $enabled = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups([self::EMPLOYEE_READ, self::EMPLOYEE_WRITE])]
    private ?\DateTimeInterface $sinceDate;

    public function __construct()
    {
        $this->sinceDate = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getRepairer(): ?Repairer
    {
        return $this->repairer;
    }

    public function setRepairer(?Repairer $repairer): self
    {
        $this->repairer = $repairer;

        return $this;
    }

    public function getEmployee(): ?User
    {
        return $this->employee;
    }

    public function setEmployee(User $employee): self
    {
        $this->employee = $employee;

        return $this;
    }

    public function isEnabled(): ?bool
    {
        return $this->enabled;
    }

    public function setEnabled(bool $enabled): self
    {
        $this->enabled = $enabled;

        return $this;
    }

    public function getSinceDate(): ?\DateTimeInterface
    {
        return $this->sinceDate;
    }

    public function setSinceDate(?\DateTimeInterface $sinceDate): self
    {
        $this->sinceDate = $sinceDate;

        return $this;
    }
}
