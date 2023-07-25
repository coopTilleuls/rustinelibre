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
    #[Assert\Email(message: 'user.email.valid')]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $email = null;

    #[Assert\Type('string')]
    #[Assert\NotBlank(message: 'repairer.plainPassword.notBlank')]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $plainPassword = null;

    #[Assert\NotBlank(message: 'user.firstName.not_blank')]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $firstName = null;

    #[Assert\NotBlank(message: 'user.lastName.not_blank')]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $lastName = null;

    #[Assert\NotBlank(message: 'repairer.name.not_blank')]
    #[Assert\Length(
        min : 2,
        max : 80,
        minMessage: 'repairer.name.min_length',
        maxMessage: 'repairer.name.max_length',
    )]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $name = null;

    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $streetNumber = null;

    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $street = null;

    #[Assert\NotBlank(message: 'repairer.city.not_blank')]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $city = null;

    #[Assert\NotBlank(message: 'repairer.postcode.not_blank')]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $postcode = null;

    #[Assert\NotNull(message: 'repairerType.name.not_blank')]
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?RepairerType $repairerType = null;

    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?string $comment = null;

    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?float $latitude = null;

    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?float $longitude = null;

    #[Assert\NotBlank(message: 'bikeType.name.not_blank')]
    #[Groups([Repairer::REPAIRER_WRITE])]
    /** @var BikeType[] */
    public ?array $bikeTypesSupported = null;
}
