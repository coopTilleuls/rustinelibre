<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
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
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: BikeTypeRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::BIKE_TYPE_READ]],
    denormalizationContext: ['groups' => [self::BIKE_TYPE_WRITE]],
)]
#[Get]
#[Put(security: "is_granted('ROLE_ADMIN')")]
#[GetCollection]
#[Post(security: "is_granted('ROLE_ADMIN')")]
#[Delete(security: "is_granted('ROLE_ADMIN')")]
class BikeType
{
    public const BIKE_TYPE_READ = 'bike_type_read';
    public const BIKE_TYPE_WRITE = 'bike_type_write';

    #[ApiProperty(identifier: true)]
    #[ORM\Column(type: 'integer')]
    #[ORM\Id, ORM\GeneratedValue()]
    #[Groups([Repairer::REPAIRER_READ, self::BIKE_TYPE_READ])]
    public ?int $id = null;

    #[Assert\NotBlank]
    #[Assert\Length(
        min : 2,
        max : 100,
    )]
    #[ORM\Column(length: 255)]
    #[Groups([Repairer::REPAIRER_READ, self::BIKE_TYPE_READ, self::BIKE_TYPE_WRITE, Bike::READ])]
    public ?string $name = null;

    #[ORM\ManyToMany(targetEntity: Repairer::class, mappedBy: 'bikeTypesSupported')]
    public Collection $repairers;

    public function __construct()
    {
        $this->repairers = new ArrayCollection();
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
