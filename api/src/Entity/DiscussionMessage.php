<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Repository\DiscussionMessageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DiscussionMessageRepository::class)]
#[ApiResource]
#[GetCollection(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Get(security: "is_granted('ROLE_ADMIN') or object.sender == user or object.discussion.customer == user or (user.repairer and user.repairer == object.discussion.repairer) 
or (user.repairerEmployee and user.repairerEmployee.repairer == object.discussion.repairer)")]
#[Post(security: "is_granted('IS_AUTHENTICATED_FULLY') and ((user.repairer and object.discussion.repairer == user.repairer) or (user.repairerEmployee and object.discussion.repairer == user.repairerEmployee.repairer) or (object.discussion.customer == user))")]
#[Delete(security: "is_granted('ROLE_ADMIN')")]
class DiscussionMessage
{
    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    public ?int $id = null;

    #[Assert\NotNull]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    public ?Discussion $discussion = null;

    #[Assert\NotNull]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    public ?User $sender = null;

    #[Assert\NotBlank]
    #[ORM\Column(length: 1000)]
    public ?string $content = null;

    #[Assert\NotNull]
    #[Assert\Type('boolean')]
    #[ORM\Column]
    public ?bool $alreadyRead = false;

    #[ORM\Column]
    public ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable('now', new \DateTimeZone('Europe/Paris'));
    }
}
