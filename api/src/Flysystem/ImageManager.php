<?php

declare(strict_types=1);

namespace App\Flysystem;

use App\Entity\MediaObject;
use Aws\S3\S3Client;
use League\Flysystem\FilesystemOperator;

readonly class ImageManager
{
    public function __construct(
        private FilesystemOperator $imagesStorage,
        private S3Client $s3Client,
        private string $storageBucket,
    ) {
    }

    public function uploadImage(MediaObject $mediaObject): void
    {
        $this->imagesStorage->write(
            $mediaObject->filePath,
            $mediaObject->file->getContent(),
            ['visibility' => $mediaObject->visibility]
        );
    }

    public function getPreSignedUrl(string $path, string $duration = '+60 minutes'): string
    {
        $command = $this->s3Client->getCommand('getObject', [
            'Bucket' => $this->storageBucket,
            'Key' => sprintf('%s/%s', 'images', $path),
        ]);

        return (string) $this->s3Client->createPresignedRequest($command, $duration)->getUri();
    }

    public function getOperator(): FilesystemOperator
    {
        return $this->imagesStorage;
    }
}
