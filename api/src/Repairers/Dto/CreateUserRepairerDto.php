<?php

declare(strict_types=1);

namespace App\Repairers\Dto;

use App\Entity\BikeType;
use App\Entity\Repairer;
use App\Entity\RepairerType;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

final class CreateUserRepairerDto
{
    #[Assert\Email]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $email = null;

    #[Assert\Type('string')]
    #[Assert\NotBlank]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $plainPassword = null;

    #[Assert\NotBlank]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $firstName = null;

    #[Assert\NotBlank]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $lastName = null;

    #[Assert\NotBlank]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $name = null;

    #[Assert\NotBlank]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $streetNumber = null;

    #[Assert\NotBlank]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $street = null;

    #[Assert\NotBlank]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $city = null;

    #[Assert\NotBlank]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $postcode = null;

    #[Assert\NotNull]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?RepairerType $repairerType = null;

    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $comment = null;

    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?float $latitude = null;

    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?float $longitude = null;

    #[Groups([Repairer::REPAIRER_WRITE])]
    /** @var BikeType[] */
    public ?array $bikeTypesSupported = null;
}
