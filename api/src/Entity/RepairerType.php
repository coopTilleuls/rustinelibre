<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\RepairerTypeRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RepairerTypeRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::REPAIRER_TYPE_READ]],
    denormalizationContext: ['groups' => [self::REPAIRER_TYPE_WRITE]],
)]
#[Get]
#[GetCollection]
#[Put(security: "is_granted('ROLE_ADMIN')")]
#[Post(security: "is_granted('ROLE_ADMIN')")]
class RepairerType
{
    public const REPAIRER_TYPE_READ = 'repairer_type_read';
    public const REPAIRER_TYPE_WRITE = 'repairer_type_write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::REPAIRER_TYPE_READ, Repairer::REPAIRER_READ])]
    private ?int $id = null;

    #[Assert\NotBlank]
    #[Assert\Length(
        min : 2,
        max : 30,
    )]
    #[ORM\Column(length: 255)]
    #[Groups([self::REPAIRER_TYPE_READ, Repairer::REPAIRER_READ, self::REPAIRER_TYPE_WRITE])]
    private ?string $name = null;

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
}
