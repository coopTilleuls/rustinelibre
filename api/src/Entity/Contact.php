<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Repository\ContactRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: ContactRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::READ]],
    denormalizationContext: ['groups' => [self::WRITE]]
)]
#[Get(security: "is_granted('ROLE_ADMIN')")]
#[GetCollection(security: "is_granted('ROLE_ADMIN')")]
#[Post]
#[Delete(security: "is_granted('ROLE_ADMIN')")]
#[Put(security: "is_granted('ROLE_ADMIN')")]
#[ApiFilter(OrderFilter::class)]
#[ApiFilter(BooleanFilter::class, properties: ['alreadyRead'])]
class Contact
{
    public const READ = 'contact_read';
    public const WRITE = 'contact_write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[ApiProperty(identifier: true)]
    #[Groups([self::READ])]
    public ?int $id = null;

    #[Assert\NotBlank]
    #[Assert\Length(
        min : 2,
        max : 100,
    )]
    #[ORM\Column(length: 100)]
    #[Groups([self::READ, self::WRITE])]
    public ?string $firstName = null;

    #[Assert\NotBlank]
    #[Assert\Length(
        min : 2,
        max : 100,
    )]
    #[ORM\Column(length: 100)]
    #[Groups([self::READ, self::WRITE])]
    public ?string $lastName = null;

    #[Assert\Email]
    #[Assert\NotBlank]
    #[Assert\Length(
        min : 2,
        max : 100,
    )]
    #[ORM\Column(length: 100)]
    #[Groups([self::READ, self::WRITE])]
    public ?string $email = null;

    #[Assert\NotBlank]
    #[Assert\Length(
        min : 10,
        max : 1000,
    )]
    #[ORM\Column(length: 1000)]
    #[Groups([self::READ, self::WRITE])]
    public ?string $content = null;

    #[Assert\NotNull]
    #[Assert\Type('boolean')]
    #[ORM\Column]
    #[Groups([self::READ, self::WRITE])]
    public ?bool $alreadyRead = false;

    #[Assert\NotNull]
    #[ORM\Column]
    public ?\DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable('now', new \DateTimeZone('Europe/Paris'));
    }
}
