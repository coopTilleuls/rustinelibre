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
    paginationClientItemsPerPage: true,
)]
#[Get(normalizationContext: ['groups' => [self::REPAIRER_READ]])]
#[GetCollection(normalizationContext: ['groups' => [self::REPAIRER_READ]])]
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

    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::REPAIRER_READ])]
    private ?int $id = null;

    #[ORM\OneToOne(inversedBy: 'repairer', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    public ?User $owner = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?RepairerType $repairerType;

    #[Assert\NotBlank]
    #[Assert\Length(
        min : 2,
        max : 80,
    )]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $name = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $description = null;

    #[Assert\Type('string')]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $mobilePhone = null;

    #[Assert\NotBlank]
    #[Assert\Type('string')]
    #[ORM\Column(length: 800, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $street = null;

    #[Assert\NotBlank]
    #[Assert\Type('string')]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $city = null;

    #[Assert\Type('string')]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $postcode = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $country = null;

    #[AppAssert\Rrule]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::REPAIRER_WRITE])]
    private ?string $rrule = 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR';

    #[ORM\ManyToMany(targetEntity: BikeType::class, inversedBy: 'repairers')]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private Collection $bikeTypesSupported;

    #[Assert\Type('string')]
    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $latitude = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $longitude = null;

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
    #[Groups([self::REPAIRER_READ])]
    private ?\DateTimeInterface $firstSlotAvailable = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $openingHours = null;

    #[Assert\Type('string')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $optionalPage = null;

    #[ORM\Column]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    #[ApiProperty(security: "is_granted('ROLE_ADMIN')")]
    #[ApiFilter(BooleanFilter::class)]
    private ?bool $enabled = false;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?MediaObject $thumbnail = null;

    #[ORM\ManyToOne(targetEntity: MediaObject::class)]
    #[ORM\JoinColumn(nullable: true)]
    #[ApiProperty(types: ['https://schema.org/image'])]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?MediaObject $descriptionPicture = null;

    #[ORM\OneToMany(mappedBy: 'repairer', targetEntity: RepairerEmployee::class, orphanRemoval: true)]
    private Collection $repairerEmployees;

    #[Assert\Type('string')]
    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups([self::REPAIRER_READ, self::REPAIRER_WRITE])]
    private ?string $comment = null;

    #[ORM\OneToMany(mappedBy: 'repairer', targetEntity: RepairerIntervention::class, orphanRemoval: true)]
    private Collection $repairerInterventions;

    public function __construct()
    {
        $this->bikeTypesSupported = new ArrayCollection();
        $this->repairerEmployees = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(?string $name): void
    {
        $this->name = $name;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): self
    {
        $this->owner = $owner;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getMobilePhone(): ?string
    {
        return $this->mobilePhone;
    }

    public function setMobilePhone(?string $mobilePhone): self
    {
        $this->mobilePhone = $mobilePhone;

        return $this;
    }

    public function getStreet(): ?string
    {
        return $this->street;
    }

    public function setStreet(?string $street): self
    {
        $this->street = $street;

        return $this;
    }

    public function getCity(): ?string
    {
        return $this->city;
    }

    public function setCity(string $city): self
    {
        $this->city = $city;

        return $this;
    }

    public function getPostcode(): ?string
    {
        return $this->postcode;
    }

    public function setPostcode(?string $postcode): self
    {
        $this->postcode = $postcode;

        return $this;
    }

    public function getCountry(): ?string
    {
        return $this->country;
    }

    public function setCountry(?string $country): self
    {
        $this->country = $country;

        return $this;
    }

    public function getRrule(): ?string
    {
        return $this->rrule;
    }

    public function setRrule(string $rrule): self
    {
        $this->rrule = $rrule;

        return $this;
    }

    public function getLatitude(): ?string
    {
        return $this->latitude;
    }

    public function setLatitude(?string $latitude): void
    {
        $this->latitude = $latitude;
    }

    public function getLongitude(): ?string
    {
        return $this->longitude;
    }

    public function setLongitude(?string $longitude): void
    {
        $this->longitude = $longitude;
    }

    public function getFirstSlotAvailable(): ?\DateTimeInterface
    {
        return $this->firstSlotAvailable;
    }

    public function setFirstSlotAvailable(?\DateTimeInterface $firstSlotAvailable): void
    {
        $this->firstSlotAvailable = $firstSlotAvailable;
    }

    /**
     * @return Collection<int, BikeType>
     */
    public function getBikeTypesSupported(): Collection
    {
        return $this->bikeTypesSupported;
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

    public function getGpsPoint(): ?string
    {
        return $this->gpsPoint;
    }

    public function setGpsPoint(?string $gpsPoint): void
    {
        $this->gpsPoint = $gpsPoint;
    }

    public function getRepairerType(): ?RepairerType
    {
        return $this->repairerType;
    }

    public function setRepairerType(?RepairerType $repairerType): void
    {
        $this->repairerType = $repairerType;
    }

    public function getOpeningHours(): ?string
    {
        return $this->openingHours;
    }

    public function setOpeningHours(?string $openingHours): self
    {
        $this->openingHours = $openingHours;

        return $this;
    }

    public function getOptionalPage(): ?string
    {
        return $this->optionalPage;
    }

    public function setOptionalPage(?string $optionalPage): self
    {
        $this->optionalPage = $optionalPage;

        return $this;
    }

    public function isEnabled(): ?bool
    {
        return $this->enabled;
    }

    public function setEnabled(bool $enabled): self
    {
        $this->enabled = $enabled;

        return $this;
    }

    public function getThumbnail(): ?MediaObject
    {
        return $this->thumbnail;
    }

    public function setThumbnail(?MediaObject $thumbnail): void
    {
        $this->thumbnail = $thumbnail;
    }

    public function getDescriptionPicture(): ?MediaObject
    {
        return $this->descriptionPicture;
    }

    public function setDescriptionPicture(?MediaObject $descriptionPicture): void
    {
        $this->descriptionPicture = $descriptionPicture;
    }

    /**
     * @return Collection<int, RepairerEmployee>
     */
    public function getRepairerEmployees(): Collection
    {
        return $this->repairerEmployees;
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

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): self
    {
        $this->comment = $comment;

        return $this;
    }

    public function getRepairerInterventions(): Collection
    {
        return $this->repairerInterventions;
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
