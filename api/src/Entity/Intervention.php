<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Intervention\Dto\CreateInterventionRepairerDto;
use App\Intervention\Filter\OwnerFilter;
use App\Intervention\State\CreateInterventionWithCurrentRepairerProcessor;
use App\Repository\InterventionRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: InterventionRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::READ]],
    denormalizationContext: ['groups' => [self::WRITE]],
    extraProperties: [
        'standard_put',
    ]
)]
#[Get]
#[GetCollection]
#[Post(security: "is_granted('ROLE_ADMIN')")]
#[Post(
    uriTemplate: '/create_repairer_interventions',
    security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')",
    input: CreateInterventionRepairerDto::class,
    processor: CreateInterventionWithCurrentRepairerProcessor::class,
)]
#[Put(security: "is_granted('ROLE_ADMIN') or (!object.isAdmin and object.canAccess(user))")]
#[Delete(security: "is_granted('ROLE_ADMIN') or (!object.isAdmin and object.canAccess(user))")]
#[ApiFilter(SearchFilter::class, properties: ['isAdmin' => 'exact'])]
#[ApiFilter(OwnerFilter::class)]
class Intervention
{
    public const READ = 'intervention_read';
    public const WRITE = 'intervention_write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::READ])]
    public ?int $id;

    #[ORM\Column(length: 255)]
    #[Groups([self::READ, self::WRITE])]
    public ?string $description = null;

    #[ORM\Column]
    #[Groups([self::READ, self::WRITE])]
    public ?bool $isAdmin = null;

    #[ORM\OneToMany(mappedBy: 'intervention', targetEntity: RepairerIntervention::class, cascade: ['persist', 'remove'])]
    public Collection $repairerInterventions;

    public function __construct()
    {
        $this->repairerInterventions = new ArrayCollection();
    }

    /**
     * @return Collection<int, RepairerIntervention>
     */
    public function getRepairerInterventions(): Collection
    {
        return $this->repairerInterventions;
    }

    public function addRepairerIntervention(RepairerIntervention $repairerIntervention): self
    {
        if (!$this->repairerInterventions->contains($repairerIntervention)) {
            $this->repairerInterventions->add($repairerIntervention);
            $repairerIntervention->intervention = $this;
        }

        return $this;
    }

    public function removeRepairerIntervention(RepairerIntervention $repairerIntervention): self
    {
        if ($this->repairerInterventions->removeElement($repairerIntervention)) {
            // set the owning side to null (unless already changed)
            if ($repairerIntervention->intervention === $this) {
                $repairerIntervention->intervention = null;
            }
        }

        return $this;
    }

    public function canAccess(?User $user): bool
    {
        if (null === $user) {
            return false;
        }

        foreach ($this->repairerInterventions as $repairerIntervention) {
            if ($repairerIntervention->repairer->owner === $user) {
                return true;
            }
        }

        return false;
    }
}
