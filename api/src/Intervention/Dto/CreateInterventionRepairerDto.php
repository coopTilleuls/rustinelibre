<?php

declare(strict_types=1);

namespace App\Intervention\Dto;

use App\Entity\Intervention;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

class CreateInterventionRepairerDto
{
    #[Assert\NotBlank, Assert\NotNull]
    #[Groups([Intervention::WRITE])]
    public string $description;

    #[Assert\GreaterThanOrEqual(0)]
    #[Groups([Intervention::WRITE])]
    public ?int $price = null;
}
