<?php

declare(strict_types=1);

namespace App\Tests\Trait;

use App\Entity\MediaObject;
use App\Repository\MediaObjectRepository;
use Symfony\Component\HttpFoundation\File\UploadedFile;

trait MediaTrait
{
    protected MediaObjectRepository $mediaRepository;

    public function getMedia(): MediaObject
    {
        $media = $this->mediaRepository->findOneBy([]);

        if (null === $media) {
            $media = new MediaObject();
            $path = sprintf('%s/../../fixtures/ratpi.png', __DIR__);
            $media->file = new UploadedFile(
                $path,
                'ratpi.png',
            );
            $media->filePath = 'ratpi.png';
            $this->mediaRepository->save($media, true);
        }

        return $media;
    }
}
