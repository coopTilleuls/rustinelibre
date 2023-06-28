<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\MediaObject;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Contracts\Translation\TranslatorInterface;

#[AsController]
final class CreateMediaObjectAction extends AbstractController
{
    public function __construct(private readonly Security $security, private readonly TranslatorInterface $translator)
    {
    }

    public function __invoke(Request $request): MediaObject
    {
        $uploadedFile = $request->files->get('file');
        if (!$uploadedFile) {
            throw new BadRequestHttpException($this->translator->trans('400_badRequest.file.required', domain:'validators'));
        }

        $mediaObject = new MediaObject();
        $mediaObject->file = $uploadedFile;
        $mediaObject->owner = $this->security->getUser();

        return $mediaObject;
    }
}
