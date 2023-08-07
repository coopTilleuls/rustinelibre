<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model\Operation;
use App\Controller\NumberOfMessageNotReadController;
use App\Controller\NumberOfMessageNotReadForDiscussionController;
use App\Controller\ReadMessageController;
use App\Messages\Validator\UniqueDiscussion;
use App\Repository\DiscussionRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: DiscussionRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::DISCUSSION_READ]],
    denormalizationContext: ['groups' => [self::DISCUSSION_WRITE]],
    mercure: true,
    paginationClievntEnabled: true,
    paginationClientItemsPerPage: true,
)]
#[GetCollection(security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Get(security: "is_granted('ROLE_ADMIN') or object.customer == user or (user.repairer and user.repairer == object.repairer) 
or (user.repairerEmployee and user.repairerEmployee.repairer == object.repairer)")]
#[Get(
    uriTemplate: '/discussions/{id}/set_read',
    controller: ReadMessageController::class,
    security: 'object.customer == user or (user.repairer and user.repairer == object.repairer) or (user.repairerEmployee and user.repairerEmployee.repairer == object.repairer)',
)]
#[GetCollection(
    uriTemplate: '/messages_unread',
    controller: NumberOfMessageNotReadController::class,
    openapi: new Operation(
        responses: [
            '200' => [
                'description' => 'Number of message not read',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'count' => [
                                    'type' => 'integer',
                                    'example' => 2,
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        summary: 'Get number of message not read',
        description: 'Get number of message not read for all discussions',
    ),
    paginationEnabled: false,
)]
#[Get(
    uriTemplate: '/messages_unread/{id}',
    controller: NumberOfMessageNotReadForDiscussionController::class,
    openapi: new Operation(
        responses: [
            '200' => [
                'description' => 'Number of message not read for a discussion',
                'content' => [
                    'application/json' => [
                        'schema' => [
                            'type' => 'object',
                            'properties' => [
                                'count' => [
                                    'type' => 'integer',
                                    'example' => 2,
                                ],
                            ],
                        ],
                    ],
                ],
            ],
        ],
        summary: 'Get number of message not read for a discussion',
        description: 'Get number of message not read for a discussion',
    ),
    security: 'object.customer == user or (user.repairer and user.repairer == object.repairer) or (user.repairerEmployee and user.repairerEmployee.repairer == object.repairer)',
)]
#[Post(securityPostDenormalize: "is_granted('ROLE_ADMIN') or (user.repairer and user.repairer == object.repairer) or (user.repairerEmployee and user.repairerEmployee.repairer == object.repairer)")]
#[Delete(security: "is_granted('ROLE_ADMIN')")]
#[ApiFilter(SearchFilter::class, properties: ['customer' => 'exact', 'repairer' => 'exact'])]
#[ApiFilter(OrderFilter::class, properties: ['lastMessage' => ['nulls_comparison' => OrderFilter::NULLS_ALWAYS_LAST]])]
#[UniqueDiscussion]
class Discussion
{
    public const DISCUSSION_READ = 'discussion_read';
    public const DISCUSSION_WRITE = 'discussion_write';

    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::DISCUSSION_READ, Appointment::APPOINTMENT_READ])]
    public ?int $id = null;

    #[Assert\NotNull(message: 'discussion.repairer.not_null')]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::DISCUSSION_READ, self::DISCUSSION_WRITE])]
    public ?Repairer $repairer = null;

    #[Assert\NotNull(message: 'discussion.customer.not_null')]
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::DISCUSSION_READ, self::DISCUSSION_WRITE])]
    public ?User $customer = null;

    #[ORM\Column(nullable: true)]
    #[Groups([self::DISCUSSION_READ, self::DISCUSSION_WRITE])]
    public ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups([self::DISCUSSION_READ])]
    public ?\DateTimeImmutable $lastMessage = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable('now', new \DateTimeZone('Europe/Paris'));
    }
}
