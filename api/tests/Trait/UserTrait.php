<?php

declare(strict_types=1);

namespace App\Tests\Trait;

use App\Entity\User;
use App\Repository\UserRepository;

trait UserTrait
{
    private UserRepository $userRepository;

    public function __construct()
    {
    }

    public function getUser(): ?User
    {
        return $this->userRepository->findOneBy([]);
    }
}
