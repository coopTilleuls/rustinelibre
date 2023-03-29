<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\BikeTypeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BikeTypeRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => ['bike_type_read']],
)]
#[Get]
#[Put(security: "is_granted('ROLE_ADMIN') ")]
#[GetCollection]
#[Post(security: "is_granted('ROLE_ADMIN')")]
#[Delete(security: "is_granted('ROLE_ADMIN')")]
class BikeType
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['repairer_read', 'bike_type_read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['repairer_read', 'bike_type_read'])]
    private ?string $name = null;

    #[ORM\ManyToMany(targetEntity: Repairer::class, mappedBy: 'bikeTypesSupported')]
    private Collection $repairers;

    public function __construct()
    {
        $this->repairers = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    /**
     * @return Collection<int, Repairer>
     */
    public function getRepairers(): Collection
    {
        return $this->repairers;
    }

    public function addRepairer(Repairer $repairer): self
    {
        if (!$this->repairers->contains($repairer)) {
            $this->repairers->add($repairer);
            $repairer->addBikeTypesSupported($this);
        }

        return $this;
    }

    public function removeRepairer(Repairer $repairer): self
    {
        if ($this->repairers->removeElement($repairer)) {
            $repairer->removeBikeTypesSupported($this);
        }

        return $this;
    }
}
