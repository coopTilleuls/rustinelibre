<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\AppointmentRepository;
use Doctrine\ORM\Mapping as ORM;

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
)]
class Appointment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(onDelete: 'CASCADE')]
    private ?User $customer = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Repairer $repairer = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $slotTime = null;

    #[ORM\Column(nullable: true)]
    private ?int $duration = 60;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCustomer(): ?User
    {
        return $this->customer;
    }

    public function setCustomer(?User $customer): self
    {
        $this->customer = $customer;

        return $this;
    }

    public function getRepairer(): ?Repairer
    {
        return $this->repairer;
    }

    public function setRepairer(?Repairer $repairer): void
    {
        $this->repairer = $repairer;
    }

    public function getSlotTime(): ?\DateTimeImmutable
    {
        return $this->slotTime;
    }

    public function setSlotTime(\DateTimeImmutable $slotTime): self
    {
        $this->slotTime = $slotTime;

        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(?int $duration): self
    {
        $this->duration = $duration;

        return $this;
    }
}
