<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
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
use App\Appointments\StateProvider\RepairerAvailableSlotsProvider;
use App\Repairers\Filter\AroundFilter;
use App\Repository\RepairerRepository;
use App\Validator as AppAssert;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Jsor\Doctrine\PostGIS\Types\PostGISType;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RepairerRepository::class)]
#[ApiResource(
    paginationClientItemsPerPage: true
)]
#[Get(normalizationContext: ['groups' => ['repairer_read']])]
#[GetCollection(normalizationContext: ['groups' => ['repairer_read']])]
#[GetCollection(
    uriTemplate: '/repairer_get_slots_available/{id}',
    requirements: ['id' => '\d+'],
    provider: RepairerAvailableSlotsProvider::class,
)]
#[Post(denormalizationContext: ['groups' => ['repairer_write']], security: "is_granted('ROLE_BOSS') or is_granted('ROLE_ADMIN')")]
#[Put(denormalizationContext: ['groups' => ['repairer_write']], security: "is_granted('ROLE_ADMIN') or object.owner == user")]
#[Delete(security: "is_granted('ROLE_ADMIN') or object.owner == user")]
#[Patch(security: "is_granted('ROLE_ADMIN') or object.owner == user")]
#[ApiFilter(DateFilter::class)]
#[ApiFilter(AroundFilter::class)]
#[ApiFilter(OrderFilter::class, properties: ['firstSlotAvailable'], arguments: ['orderParameterName' => 'order'])]
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
class Repairer
{
    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['repairer_read'])]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'repairers')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups(['repairer_read', 'repairer_write'])]
    private ?User $owner;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['repairer_read', 'repairer_write'])]
    private ?RepairerType $repairerType;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['repairer_read', 'repairer_write'])]
    private ?string $name = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['repairer_read', 'repairer_write'])]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['repairer_read', 'repairer_write'])]
    private ?string $mobilePhone = null;

    #[ORM\Column(length: 800, nullable: true)]
    #[Groups(['repairer_read', 'repairer_write'])]
    private ?string $street = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['repairer_read', 'repairer_write'])]
    private ?string $city = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['repairer_read', 'repairer_write'])]
    private ?string $postcode = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['repairer_read', 'repairer_write'])]
    private ?string $country = null;

    #[AppAssert\Rrule]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['repairer_write'])]
    private ?string $rrule = 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR';

    #[ORM\ManyToMany(targetEntity: BikeType::class, inversedBy: 'repairers')]
    #[Groups(['repairer_read', 'repairer_write'])]
    private Collection $bikeTypesSupported;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups(['repairer_read', 'repairer_write'])]
    private ?string $latitude = null;

    #[ORM\Column(type: 'string', nullable: true)]
    #[Groups(['repairer_read', 'repairer_write'])]
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
    #[Groups(['repairer_read'])]
    private ?\DateTimeInterface $firstSlotAvailable = null;

    public function __construct()
    {
        $this->bikeTypesSupported = new ArrayCollection();
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

    public function getOwner(): User
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
}
