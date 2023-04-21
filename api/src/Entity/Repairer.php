<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
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
use App\Appointments\StateProvider\RepairerAvailableSlotsProvider;
use App\Repairers\Dto\CreateUserRepairerDto;
use App\Repairers\Filter\AroundFilter;
use App\Repairers\Filter\FirstAvailableSlotFilter;
use App\Repairers\Filter\ProximityFilter;
use App\Repairers\Filter\RandomFilter;
use App\Repairers\State\CreateUserRepairerProcessor;
use App\Repository\RepairerRepository;
use App\Validator as AppAssert;
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
    openapi: new Model\Operation(
        summary: 'Retrieves the collection of availabilities of a repairer',
        description: 'Retrieves all the availabilities of a repairer'),
    provider: RepairerAvailableSlotsProvider::class,
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
#[Put(denormalizationContext: ['groups' => [self::REPAIRER_WRITE]], security: "is_granted('ROLE_ADMIN') or object.owner == user")]
#[Delete(security: "is_granted('ROLE_ADMIN') or object.owner == user")]
#[Patch(security: "is_granted('ROLE_ADMIN') or object.owner == user")]
#[ApiFilter(AroundFilter::class)]
#[ApiFilter(FirstAvailableSlotFilter::class)]
#[ApiFilter(SearchFilter::class, properties: [
    'city' => 'iexact',
    'description' => 'ipartial',
    'postcode' => 'iexact',
    'country' => 'ipartial',
    'bikeTypesSupported.id' => 'exact',
    'bikeTypesSupported.name' => 'ipartial',
    'repairerType.id' => 'exact',
    'repairerType.name' => 'ipartial',
])]
#[ApiFilter(AroundFilter::class)]
#[ApiFilter(ProximityFilter::class)]
#[ApiFilter(RandomFilter::class)]
#[UniqueEntity('owner')]
class Repairer
{
    public const REPAIRER_READ = 'repairer_read';
    public const REPAIRER_WRITE = 'repairer_write';
    public const REPAIRER_COLLECTION_READ = 'repairer_collection_read';

    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_COLLECTION_READ])]
    public ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'repairer', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?User $owner = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ])]
    public ?RepairerType $repairerType;

    #[Assert\NotBlank]
    #[Assert\Length(
        min : 2,
        max : 80,
    )]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ])]
    public ?string $name = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?string $description = null;

    #[Assert\Type('string')]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?string $mobilePhone = null;

    #[Assert\NotBlank]
    #[Assert\Type('string')]
    #[ORM\Column(length: 800, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ])]
    public ?string $street = null;

    #[Assert\NotBlank]
    #[Assert\Type('string')]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ])]
    public ?string $city = null;

    #[Assert\Type('string')]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ])]
    public ?string $postcode = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?string $country = null;

    #[AppAssert\Rrule]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_WRITE])]
    public ?string $rrule = 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR';

    #[ORM\ManyToMany(targetEntity: BikeType::class, inversedBy: 'repairers')]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public Collection $bikeTypesSupported;

    #[Assert\Type('string')]
    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ])]
    public ?string $latitude = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ])]
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
    #[Groups([self::REPAIRER_READ, self::REPAIRER_COLLECTION_READ])]
    public ?\DateTimeInterface $firstSlotAvailable = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?string $openingHours = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?string $optionalPage = null;

    #[ORM\Column]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    #[ApiProperty(security: "is_granted('ROLE_ADMIN')")]
    #[ApiFilter(BooleanFilter::class)]
    public ?bool $enabled = false;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE, self::REPAIRER_COLLECTION_READ])]
    public ?MediaObject $thumbnail = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
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

    public function __construct()
    {
        $this->bikeTypesSupported = new ArrayCollection();
        $this->repairerEmployees = new ArrayCollection();
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
