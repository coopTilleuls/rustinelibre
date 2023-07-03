<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\OpenApi\Model;
use App\Controller\CreateMediaObjectFileAction;
use App\Controller\CreateMediaObjectImageAction;
use App\Repository\MediaObjectRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;

#[Vich\Uploadable]
#[ORM\Entity(repositoryClass: MediaObjectRepository::class)]
#[ApiResource(
    types: ['https://schema.org/MediaObject'],
    normalizationContext: ['groups' => [self::MEDIA_OBJECT_READ]]
)]
#[Get]
#[Delete(security: "is_granted('ROLE_ADMIN') or object.owner == user")]
#[GetCollection(security: "is_granted('ROLE_ADMIN')")]
#[Post(
    '/media_objects/images',
    controller: CreateMediaObjectImageAction::class,
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
    security: "is_granted('IS_AUTHENTICATED_FULLY')",
    validationContext: ['groups' => ['Default', self::MEDIA_OBJECT_CREATE_IMAGE]],
    deserialize: false
)]
#[Post(
    '/media_objects/files',
    controller: CreateMediaObjectFileAction::class,
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
    security: "is_granted('IS_AUTHENTICATED_FULLY')",
    validationContext: ['groups' => ['Default', self::MEDIA_OBJECT_CREATE_FILE]],
    deserialize: false
)]
class MediaObject
{
    public const MEDIA_OBJECT_CREATE_IMAGE = 'media_object_create_image';
    public const MEDIA_OBJECT_CREATE_FILE = 'media_object_create_file';
    public const MEDIA_OBJECT_READ = 'media_object:read';

    #[ORM\Id, ORM\Column, ORM\GeneratedValue]
    public ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    public ?User $owner = null;

    #[ApiProperty(types: ['https://schema.org/contentUrl'])]
    #[Groups([self::MEDIA_OBJECT_READ, Repairer::REPAIRER_READ, Repairer::REPAIRER_COLLECTION_READ, Bike::READ, Maintenance::READ, Appointment::APPOINTMENT_READ, AutoDiagnostic::READ, Appointment::APPOINTMENT_READ, User::USER_READ])]
    public ?string $contentUrl = null;

    #[Assert\File(maxSize: '5120k', mimeTypes: ['image/jpeg', 'image/png', 'image/webp'], groups: [self::MEDIA_OBJECT_CREATE_IMAGE])]
    #[Assert\File(maxSize: '5120k', mimeTypes: [
        'application/pdf', // .pdf
        'application/msword', // .doc
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/vnd.oasis.opendocument.text', // .odt
        'application/vnd.ms-excel', // .xls
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'text/csv', // .csv
    ], maxSizeMessage: 'mediaObject.file.maxSize', mimeTypesMessage: 'mediaObject.file.file.format', groups: [self::MEDIA_OBJECT_CREATE_FILE])]
    #[Assert\NotNull(message: 'mediaObject.file.not_null', groups: [self::MEDIA_OBJECT_CREATE_IMAGE, self::MEDIA_OBJECT_CREATE_FILE])]
    public ?File $file = null;

    #[ORM\Column(nullable: true)]
    public ?string $filePath = null;

    #[Groups([self::MEDIA_OBJECT_CREATE_IMAGE, self::MEDIA_OBJECT_CREATE_FILE])]
    public bool $visibility = false;

    #[Groups([self::MEDIA_OBJECT_READ, Repairer::REPAIRER_READ, Repairer::REPAIRER_COLLECTION_READ, Bike::READ, Maintenance::READ, Appointment::APPOINTMENT_READ, AutoDiagnostic::READ, Appointment::APPOINTMENT_READ, User::USER_READ])]
    public ?bool $viewable = null;
}
