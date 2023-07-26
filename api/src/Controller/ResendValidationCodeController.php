<?php

declare(strict_types=1);

namespace App\Controller;

use App\Emails\ValidationCodeEmail;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
final class ResendValidationCodeController
{
    public function __construct(private readonly Security $security,
        private readonly ValidationCodeEmail $validationCodeEmail)
    {
    }

    public function __invoke(Request $request): User
    {
        /** @var User $currentUser */
        $currentUser = $this->security->getUser();
        if (!$currentUser->validationCode) {
            return $currentUser;
        }

        $this->validationCodeEmail->sendValidationCodeEmail($currentUser);

        return $currentUser;
    }
}
