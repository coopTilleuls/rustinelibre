<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\OpenApi\Model;
use App\Controller\BuildRepairerSlotsAvailableAction;
use App\Repairers\Dto\CreateUserRepairerDto;
use App\Repairers\Filter\AroundFilter;
use App\Repairers\Filter\FirstSlotAvailableFilter;
use App\Repairers\Filter\ProximityFilter;
use App\Repairers\Filter\RandomFilter;
use App\Repairers\State\CreateUserRepairerProcessor;
use App\Repairers\Validator\RepairerSlots;
use App\Repository\RepairerRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Jsor\Doctrine\PostGIS\Types\PostGISType;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RepairerRepository::class)]
#[ApiResource(
    denormalizationContext: ['groups' => ['admin_only']],
    paginationClientEnabled: true,
    paginationClientItemsPerPage: true,
)]
#[Get(normalizationContext: ['groups' => [self::REPAIRER_READ]])]
#[GetCollection(normalizationContext: ['groups' => [self::REPAIRER_COLLECTION_READ]])]
#[GetCollection(
    uriTemplate: '/repairer_get_slots_available/{id}',
    requirements: ['id' => '\d+'],
    controller: BuildRepairerSlotsAvailableAction::class,
    openapi: new Model\Operation(
        summary: 'Retrieves the collection of availabilities of a repairer for 60 next days',
        description: 'Retrieves all the availabilities of a repairer')
)]
#[Post(denormalizationContext: ['groups' => [self::REPAIRER_WRITE]], security: "is_granted('IS_AUTHENTICATED_FULLY')")]
#[Post(
    uriTemplate: '/create_user_and_repairer',
    openapi: new Model\Operation(
        summary: 'Creates a repairer and its owner',
        description: 'Creates a repairer, its owner and bind it'),
    description: 'Allows the simultaneous creation of a user (boss) and an inactive repairer waiting for validation',
    denormalizationContext: ['groups' => [self::REPAIRER_WRITE]],
    input: CreateUserRepairerDto::class,
    processor: CreateUserRepairerProcessor::class
)]
#[Put(denormalizationContext: ['groups' => [self::REPAIRER_WRITE]], security: "is_granted('ROLE_ADMIN') or (object.owner == user and object.enabled == true)")]
#[Delete(security: "is_granted('ROLE_ADMIN') or (object.owner == user and object.enabled == true)")]
#[Patch(security: "is_granted('ROLE_ADMIN') or (object.owner == user and object.enabled == true)")]
#[ApiFilter(AroundFilter::class)]
#[ApiFilter(FirstSlotAvailableFilter::class)]
#[ApiFilter(OrderFilter::class, properties: ['id'], arguments: ['orderParameterName' => 'order'])]
#[ApiFilter(SearchFilter::class, properties: [
    'city' => 'iexact',
    'name' => 'ipartial',
    'description' => 'ipartial',
    'postcode' => 'iexact',
    'country' => 'ipartial',
    'bikeTypesSupported.id' => 'exact',
    'bikeTypesSupported.name' => 'ipartial',
    'repairerType.id' => 'exact',
    'repairerType.name' => 'ipartial',
])]
#[ApiFilter(ProximityFilter::class)]
#[ApiFilter(RandomFilter::class)] // Should always be last filter of the list
#[UniqueEntity('owner')]
#[RepairerSlots]
class Repairer
{
    public const REPAIRER_READ = 'repairer_read';
    public const REPAIRER_WRITE = 'repairer_write';
    public const REPAIRER_COLLECTION_READ = 'repairer_collection_read';

    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_COLLECTION_READ, Appointment::APPOINTMENT_READ, Discussion::DISCUSSION_READ, User::USER_READ])]
    public ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'repairer', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ])]
    public ?User $owner = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ, User::USER_READ])]
    public ?RepairerType $repairerType;

    #[Assert\NotBlank(message: 'repairer.name.not_blank')]
    #[Assert\Length(
        min : 2,
        max : 80,
        minMessage: 'repairer.name.min_length',
        maxMessage: 'repairer.name.max_length',
    )]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ, Appointment::APPOINTMENT_READ, Discussion::DISCUSSION_READ, User::USER_READ])]
    public ?string $name = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, User::USER_READ])]
    public ?string $description = null;

    #[Assert\Type('string')]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, User::USER_READ])]
    public ?string $mobilePhone = null;

    #[Assert\Type('string')]
    #[ORM\Column(length: 800, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ, Appointment::APPOINTMENT_READ, User::USER_READ])]
    public ?string $street = null;

    #[Assert\Type('string')]
    #[ORM\Column(length: 30, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ, Appointment::APPOINTMENT_READ, User::USER_READ])]
    public ?string $streetNumber = null;

    #[Assert\NotBlank]
    #[Assert\Type('string')]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ, Appointment::APPOINTMENT_READ, User::USER_READ])]
    public ?string $city = null;

    #[Assert\Type('string')]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ, User::USER_READ])]
    public ?string $postcode = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, User::USER_READ])]
    public ?string $country = null;

    #[ORM\ManyToMany(targetEntity: BikeType::class, inversedBy: 'repairers')]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, User::USER_READ])]
    public Collection $bikeTypesSupported;

    #[Assert\Type('string')]
    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ, User::USER_READ])]
    public ?string $latitude = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ, User::USER_READ])]
    public ?string $longitude = null;

    #[ORM\Column(
        type: PostGISType::GEOGRAPHY,
        nullable: true,
        options: [
            'geometry_type' => 'POINT',
            'srid' => 4326,
        ],
    )]
    public ?string $gpsPoint;

    #[ORM\Column(type: 'datetime', nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_COLLECTION_READ, User::USER_READ])]
    public ?\DateTimeInterface $firstSlotAvailable = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, User::USER_READ])]
    public ?string $openingHours = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, User::USER_READ])]
    public ?string $optionalPage = null;

    #[ORM\Column]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ])]
    #[ApiProperty(security: "is_granted('ROLE_ADMIN')")]
    #[ApiFilter(BooleanFilter::class)]
    public ?bool $enabled = false;

    #[ORM\ManyToOne(targetEntity: MediaObject::class, cascade: ['remove'])]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ, Appointment::APPOINTMENT_READ, User::USER_READ])]
    public ?MediaObject $thumbnail = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class, cascade: ['remove'])]
    #[ORM\JoinColumn(nullable: true, onDelete: 'SET NULL')]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, User::USER_READ, self::REPAIRER_COLLECTION_READ])]
    public ?MediaObject $descriptionPicture = null;

    #[ORM\OneToMany(mappedBy: 'repairer', targetEntity: RepairerEmployee::class, orphanRemoval: true)]
    public Collection $repairerEmployees;

    #[Assert\Type('string')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?string $comment = null;

    #[ORM\OneToMany(mappedBy: 'repairer', targetEntity: RepairerIntervention::class, orphanRemoval: true)]
    public Collection $repairerInterventions;

    #[Groups([self::REPAIRER_READ])]
    #[ORM\Column(length: 255, nullable: true)]
    public ?string $slug = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    public ?\DateTimeInterface $createdAt = null;

    #[Groups([self::REPAIRER_COLLECTION_READ])]
    public ?int $distance = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Type('integer')]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?int $durationSlot = 60;

    #[ORM\Column(nullable: true)]
    #[Assert\Type('integer')]
    #[Assert\Range(
        notInRangeMessage: 'repairer.number_of_slots.range',
        min: 1,
        max: 10,
    )]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?int $numberOfSlots = 1;

    public function __construct()
    {
        $this->bikeTypesSupported = new ArrayCollection();
        $this->repairerEmployees = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function addBikeTypesSupported(BikeType $bikeTypesSupported): self
    {
        if (!$this->bikeTypesSupported->contains($bikeTypesSupported)) {
            $this->bikeTypesSupported->add($bikeTypesSupported);
        }

        return $this;
    }

    public function removeBikeTypesSupported(BikeType $bikeTypesSupported): self
    {
        $this->bikeTypesSupported->removeElement($bikeTypesSupported);

        return $this;
    }

    public function addRepairerEmployee(RepairerEmployee $repairerEmployee): self
    {
        if (!$this->repairerEmployees->contains($repairerEmployee)) {
            $this->repairerEmployees->add($repairerEmployee);
            $repairerEmployee->repairer = $this;
        }

        return $this;
    }

    public function removeRepairerEmployee(RepairerEmployee $repairerEmployee): self
    {
        if ($this->repairerEmployees->removeElement($repairerEmployee)) {
            // set the owning side to null (unless already changed)
            if ($repairerEmployee->repairer === $this) {
                $repairerEmployee->repairer = null;
            }
        }

        return $this;
    }

    public function addRepairerIntervention(RepairerIntervention $repairerIntervention): self
    {
        if (!$this->repairerInterventions->contains($repairerIntervention)) {
            $this->repairerInterventions->add($repairerIntervention);
            $repairerIntervention->repairer = $this;
        }

        return $this;
    }

    public function removeRepairerIntervention(RepairerIntervention $repairerIntervention): self
    {
        if ($this->repairerInterventions->removeElement($repairerIntervention)) {
            if ($repairerIntervention->repairer === $this) {
                unset($repairerIntervention->repairer);
            }
        }

        return $this;
    }
}
