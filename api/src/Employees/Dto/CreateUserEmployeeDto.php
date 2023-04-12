<?php

declare(strict_types=1);

namespace App\Employees\Dto;

use App\Entity\Repairer;
use App\Entity\RepairerEmployee;
use App\Entity\User;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

final class CreateUserEmployeeDto
{
    #[Assert\Email]
    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?string $email = null;

    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?string $plainPassword = null;

    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?string $firstName = null;

    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?string $lastName = null;

    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?User $user = null;

    #[Groups([RepairerEmployee::EMPLOYEE_WRITE])]
    public ?Repairer $repairer = null;
}
