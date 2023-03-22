<?php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Appointments\StateProvider\LocationAvailableSlotsProvider;
use App\Repository\LocationRepository;
use App\Validator as AppAssert;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LocationRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new GetCollection(
            provider: LocationAvailableSlotsProvider::class,
            uriTemplate: '/locations_get_slots_available/{id}',
            requirements: ['id' => '\d+'],
            options: ['my_option' => 'my_option_value'],
        ),
        new Post(),
        new Patch(),
        new Put(),
        new Delete(),
    ]
)]
#[ApiFilter(DateFilter::class)]
class Location
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'locations')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    private Repairer $repairer;

    #[ORM\Column(length: 800, nullable: true)]
    private ?string $street = null;

    #[ORM\Column(length: 255)]
    private ?string $city = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $postcode = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $country = null;

    #[AppAssert\Rrule]
    #[ORM\Column(length: 255)]
    private ?string $rrule = 'FREQ=MINUTELY;INTERVAL=60;BYHOUR=9,10,11,12,13,14,15,16;BYDAY=MO,TU,WE,TH,FR';

    #[ORM\Column]
    private ?int $minimumPreparationDelay = 30;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $latitude = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $longitude = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getMinimumPreparationDelay(): ?int
    {
        return $this->minimumPreparationDelay;
    }

    public function setMinimumPreparationDelay(int $minimumPreparationDelay): self
    {
        $this->minimumPreparationDelay = $minimumPreparationDelay;

        return $this;
    }

    public function getRepairer(): Repairer
    {
        return $this->repairer;
    }

    public function setRepairer(Repairer $repairer): void
    {
        $this->repairer = $repairer;
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
}
