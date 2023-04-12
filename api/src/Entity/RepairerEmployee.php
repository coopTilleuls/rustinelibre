<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\RepairerEmployeeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RepairerEmployeeRepository::class)]
#[ApiResource]
#[Get(security: "is_granted('ROLE_ADMIN') or object.repairer == user.repairer")]
#[GetCollection(security: "is_granted('ROLE_ADMIN') or object.repairer == user.repairer")]
#[Post(security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')")]
#[Put(security: "is_granted('ROLE_ADMIN') or object.repairer == user.repairer")]
#[Delete(security: "is_granted('ROLE_ADMIN') or object.repairer == user.repairer")]
class RepairerEmployee
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'repairerEmployees', cascade: ['remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Repairer $repairer = null;

    #[ORM\OneToOne(inversedBy: 'repairerEmployee', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $employee = null;

    #[ORM\Column]
    private ?bool $enabled = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
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
