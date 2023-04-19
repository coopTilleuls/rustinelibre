<?php

declare(strict_types=1);

namespace App\Employees\Dto;

use App\Entity\Repairer;
use App\Entity\RepairerEmployee;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

final class CreateUserEmployeeDto
{
    #[Assert\Email]
    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?string $email = null;

    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?string $plainPassword = null;

    #[Assert\NotBlank]
    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?string $firstName = null;

    #[Assert\NotBlank]
    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?string $lastName = null;

    #[Assert\Type('boolean')]
    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?bool $enabled = null;

    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?Repairer $repairer = null;
}
