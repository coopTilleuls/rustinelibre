<?php

declare(strict_types=1);

namespace App\Controller;

use App\Emails\ForgotPasswordEmail;
use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Contracts\Translation\TranslatorInterface;

#[AsController]
final class ForgotPasswordController
{
    public function __construct(private readonly ForgotPasswordEmail $forgotPasswordEmail, private readonly UserRepository $userRepository, private readonly TranslatorInterface $translator)
    {
    }

    public function __invoke(Request $request): JsonResponse
    {
        $requestContent = json_decode($request->getContent(), true);
        if (!array_key_exists('email', $requestContent)) {
            throw new BadRequestHttpException($this->translator->trans('400_no_email', domain: 'validators'));
        }

        $user = $this->userRepository->findOneBy(['email' => $requestContent['email']]);

        if (!$user instanceof User) {
            throw new BadRequestHttpException($this->translator->trans('400_email_unknown', domain: 'validators'));
        }

        $user->forgotPasswordToken = bin2hex(random_bytes(100));
        $this->userRepository->save(entity: $user, flush: true);
        $this->forgotPasswordEmail->sendForgotPasswordEmail(user: $user);

        return new JsonResponse();
    }
}
