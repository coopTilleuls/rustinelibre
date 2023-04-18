<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model;
use App\Controller\CreateMediaObjectAction;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[Vich\Uploadable]
#[ORM\Entity]
#[ApiResource(
    types: ['https://schema.org/MediaObject'],
    operations: [
        new Get(),
        new GetCollection(security: "is_granted('ROLE_ADMIN')"),
        new Post(
            controller: CreateMediaObjectAction::class,
            openapi: new Model\Operation(
                requestBody: new Model\RequestBody(
                    content: new \ArrayObject([
                        'multipart/form-data' => [
                            'schema' => [
                                'type' => 'object',
                                'properties' => [
                                    'file' => [
                                        'type' => 'string',
                                        'format' => 'binary',
                                    ],
                                ],
                            ],
                        ],
                    ])
                )
            ),
            security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')",
            validationContext: ['groups' => ['Default', self::MEDIA_OBJECT_CREATE]],
            deserialize: false
        ),
    ],
    normalizationContext: ['groups' => [self::MEDIA_OBJECT_READ]]
)]
class MediaObject
{
    public const MEDIA_OBJECT_CREATE = 'media_object_create';
    public const MEDIA_OBJECT_READ = 'media_object:read';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    public ?int $id = null;

    #[ApiProperty(types: ['https://schema.org/contentUrl'])]
    #[Groups([self::MEDIA_OBJECT_READ, Repairer::REPAIRER_READ])]
    public ?string $contentUrl = null;

    #[Vich\UploadableField(mapping: 'media_object', fileNameProperty: 'filePath')]
    #[Assert\NotNull(groups: [self::MEDIA_OBJECT_CREATE])]
    public ?File $file = null;

    #[ORM\Column(nullable: true)]
    public ?string $filePath = null;

    #[ORM\OneToMany(targetEntity: Repairer::class, mappedBy: 'thumbnail')]
    public Collection $repairersThumbnail;

    #[ORM\OneToMany(targetEntity: Repairer::class, mappedBy: 'descriptionPicture')]
    public Collection $repairersDescriptionPicture;

    public function __construct()
    {
        $this->repairersThumbnail = new ArrayCollection();
        $this->repairersDescriptionPicture = new ArrayCollection();
    }
}
