<?php

declare(strict_types=1);

namespace App\Repairers\Dto;

use App\Entity\Repairer;
use App\Entity\RepairerAvailability;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

final class CreateAvailabilityDto
{
    #[Groups([RepairerAvailability::WRITE])]
    public Repairer $repairer;

    #[Assert\Type('string')]
    #[Groups([RepairerAvailability::WRITE])]
    public ?string $day = null;

    #[Assert\Regex("/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/")]
    #[Groups([RepairerAvailability::WRITE])]
    public ?string $startTime = null;

    #[Assert\Regex("/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/")]
    #[Groups([RepairerAvailability::WRITE])]
    public ?string $endTime = null;
}
