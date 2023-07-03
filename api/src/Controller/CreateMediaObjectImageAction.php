<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\MediaObject;
use App\Flysystem\ImageManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

#[AsController]
final class CreateMediaObjectImageAction extends AbstractController
{
    public function __construct(
        private readonly Security $security,
        private readonly TranslatorInterface $translator,
        private readonly ImageManager $imagesStorage,
        private readonly SluggerInterface $slugger
    ) {
    }

    public function __invoke(Request $request): MediaObject
    {
        $uploadedFile = $request->files->get('file');
        if (!$uploadedFile) {
            throw new BadRequestHttpException($this->translator->trans('400_badRequest.file.required', domain: 'validators'));
        }

        $mediaObject = new MediaObject();
        $mediaObject->file = $uploadedFile;
        $mediaObject->owner = $this->security->getUser();
        $this->uploadImage($mediaObject);

        return $mediaObject;
    }

    public function uploadImage(MediaObject $mediaObject): void
    {
        $parts = explode('.', $mediaObject->file->getClientOriginalName());
        $slugName = (string) $this->slugger->slug(strtolower($parts[0]));
        $mediaObject->filePath = sprintf('%d-%s.%s', time(), $slugName, $parts[1]);

        $this->imagesStorage->uploadImage($mediaObject);
    }
}
