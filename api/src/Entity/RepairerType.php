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
    #[Groups([self::REPAIRER_TYPE_READ, Repairer::REPAIRER_READ, Repairer::REPAIRER_COLLECTION_READ])]
    public ?int $id = null;

    #[Assert\NotBlank(message: 'repairerType.name.not_blank')]
    #[Assert\Length(
        min : 2,
        max : 50,
        minMessage: 'repairerType.name.min_length',
        maxMessage: 'repairerType.name.max_length',
    )]
    #[ORM\Column(length: 255)]
    #[Groups([self::REPAIRER_TYPE_READ, Repairer::REPAIRER_READ, self::REPAIRER_TYPE_WRITE, Repairer::REPAIRER_COLLECTION_READ, User::USER_READ])]
    public ?string $name = null;
}
