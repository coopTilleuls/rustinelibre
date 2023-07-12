<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

#[AsController]
final class ResetPasswordController
{
    public function __construct(private readonly UserRepository $userRepository,
        private readonly UserPasswordHasherInterface $userPasswordHasher,
        private readonly TranslatorInterface $translator)
    {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $requestContent = json_decode($request->getContent(), true);
        if (!array_key_exists('token', $requestContent)) {
            throw new BadRequestHttpException($this->translator->trans('400_no_token', domain: 'validators'));
        }

        if (!array_key_exists('password', $requestContent)) {
            throw new BadRequestHttpException($this->translator->trans('400_no_password', domain: 'validators'));
        }

        $user = $this->userRepository->findOneBy(['forgotPasswordToken' => $requestContent['token']]);

        if (!$user instanceof User) {
            throw new BadRequestHttpException($this->translator->trans('400_no_token', domain: 'validators'));
        }

        $hashedPassword = $this->userPasswordHasher->hashPassword($user, $requestContent['password']);
        $user->password = $hashedPassword;
        $user->forgotPasswordToken = null;
        $this->userRepository->save($user, true);

        return new JsonResponse();
    }
}
