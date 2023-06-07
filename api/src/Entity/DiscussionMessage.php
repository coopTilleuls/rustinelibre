<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Messages\Validator\MessageDiscussionCheck;
use App\Repository\DiscussionMessageRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DiscussionMessageRepository::class)]
#[ApiResource(
    order: ['createdAt' => 'DESC'],
    paginationClientItemsPerPage: true,
    normalizationContext: ['groups' => [self::MESSAGE_READ]],
    denormalizationContext: ['groups' => [self::MESSAGE_WRITE]]
)]
#[GetCollection(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Get(security: "is_granted('ROLE_ADMIN') or object.sender == user or object.discussion.customer == user or (user.repairer and user.repairer == object.discussion.repairer) 
or (user.repairerEmployee and user.repairerEmployee.repairer == object.discussion.repairer)")]
#[Post(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Delete(security: "is_granted('ROLE_ADMIN')")]
#[ApiFilter(SearchFilter::class, properties: ['discussion' => 'exact'])]
#[MessageDiscussionCheck]
class DiscussionMessage
{
    public const MESSAGE_READ = 'message_read';
    public const MESSAGE_WRITE = 'message_write';

    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::MESSAGE_READ])]
    public ?int $id = null;

    #[Assert\NotNull]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::MESSAGE_READ, self::MESSAGE_WRITE])]
    public ?Discussion $discussion = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::MESSAGE_READ, self::MESSAGE_WRITE])]
    public ?User $sender = null;

    #[Assert\NotBlank]
    #[ORM\Column(length: 1000)]
    #[Groups([self::MESSAGE_READ, self::MESSAGE_WRITE])]
    public ?string $content = null;

    #[Assert\NotNull]
    #[Assert\Type('boolean')]
    #[ORM\Column]
    #[Groups([self::MESSAGE_READ, self::MESSAGE_WRITE])]
    public ?bool $alreadyRead = false;

    #[ORM\Column]
    #[Groups([self::MESSAGE_READ])]
    public ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable('now', new \DateTimeZone('Europe/Paris'));
    }
}
