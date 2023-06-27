<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

#[AsController]
final class UserValidationCodeController
{
    public function __construct(private Security $security, private UserRepository $userRepository)
    {
    }

    public function __invoke(Request $request): User
    {
        /** @var User $currentUser */
        $currentUser = $this->security->getUser();
        if (!$currentUser->validationCode) {
            return $currentUser;
        }

        $requestContent = json_decode($request->getContent(), true);
        if (!array_key_exists('code', $requestContent)) {
            throw new BadRequestHttpException('badRequest.validation.code');
        }

        if (!in_array((int) $requestContent['code'], [$currentUser->validationCode, 6666])) { // @todo change this when mail OK
            throw new AccessDeniedHttpException('access.denied.validation.code');
        }

        $currentUser->emailConfirmed = true;
        $this->userRepository->save($currentUser, true);

        return $currentUser;
    }
}
