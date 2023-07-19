<?php

declare(strict_types=1);

namespace App\Flysystem;

use App\Entity\MediaObject;
use Aws\S3\S3Client;
use League\Flysystem\FilesystemOperator;

readonly class MediaObjectManager
{
    public function __construct(
        private FilesystemOperator $imagesStorage,
        private FilesystemOperator $filesStorage,
        private S3Client $s3Client,
        private string $storageBucket,
    ) {
    }

    public function upload(MediaObject $mediaObject, string $prefix): void
    {
        $storage = $this->getOperator($prefix);
        $storage->write(
            $mediaObject->filePath,
            $mediaObject->file->getContent(),
            ['visibility' => $mediaObject->visibility]
        );
    }

    public function getPrefixOfMediaObject(MediaObject $mediaObject): ?string
    {
        if ($this->imagesStorage->fileExists($mediaObject->filePath)) {
            return 'images';
        }

        if ($this->filesStorage->fileExists($mediaObject->filePath)) {
            return 'files';
        }

        return null;
    }

    /**
     * @param string $prefix The prefix used by wanted flysystem storage (e.g: 'images')
     */
    public function getPreSignedUrl(string $path, string $prefix, string $duration = '+60 minutes'): string
    {
        $command = $this->s3Client->getCommand('getObject', [
            'Bucket' => $this->storageBucket,
            'Key' => sprintf('%s/%s', $prefix, $path),
        ]);

        return (string) $this->s3Client->createPresignedRequest($command, $duration)->getUri();
    }

    public function getOperator(string $prefix): FilesystemOperator
    {
        return 'images' === $prefix ? $this->imagesStorage : $this->filesStorage;
    }

    public function visibility(string $prefix, ?string $filePath = ''): string
    {
        return $this->getOperator($prefix)->visibility($filePath);
    }

    public function publicUrl(string $prefix, ?string $filePath = ''): string
    {
        return $this->getOperator($prefix)->publicUrl($filePath);
    }
}
