<?php

declare(strict_types=1);

namespace App\Controller;

use App\Entity\MediaObject;
use App\Flysystem\MediaObjectManager;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Contracts\Translation\TranslatorInterface;

#[AsController]
final class CreateMediaObjectAction extends AbstractController
{
    public function __construct(
        private readonly Security $security,
        private readonly TranslatorInterface $translator,
        private readonly MediaObjectManager $mediaObjectManager,
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
        $mediaObject = $this->addFilePath($mediaObject);
        $prefix = 'media_object_add_image' === $request->get('_route') ? 'images' : 'files';
        $this->mediaObjectManager->upload($mediaObject, $prefix);

        return $mediaObject;
    }

    public function addFilePath(MediaObject $mediaObject): MediaObject
    {
        if (!$mediaObject->file instanceof UploadedFile) {
            $randomString = bin2hex(random_bytes(16));
            $mediaObject->filePath = sprintf('%d-%s.%s', time(), $randomString, $mediaObject->file->guessExtension());
        } else {
            $parts = explode('.', $mediaObject->file->getClientOriginalName());
            $slugName = (string) $this->slugger->slug(strtolower($parts[0]));
            $mediaObject->filePath = sprintf('%d-%s.%s', time(), $slugName, $mediaObject->file->getClientOriginalExtension());
        }

        return $mediaObject;
    }
}
