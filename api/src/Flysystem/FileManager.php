<?php

declare(strict_types=1);

namespace App\Flysystem;

use App\Entity\MediaObject;
use Aws\S3\S3Client;
use League\Flysystem\FilesystemOperator;

readonly class FileManager
{
    public function __construct(
        private FilesystemOperator $filesStorage,
        private S3Client $s3Client,
        private string $storageBucket,
    ) {
    }

    public function uploadFile(MediaObject $mediaObject): void
    {
        $this->filesStorage->write(
            $mediaObject->filePath,
            $mediaObject->file->getContent(),
            ['visibility' => $mediaObject->visibility ? 'public' : 'private']
        );
    }

    public function getPreSignedUrl(string $path, string $duration = '+1 minute'): string
    {
        $command = $this->s3Client->getCommand('getObject', [
            'Bucket' => $this->storageBucket,
            'Key' => sprintf('%s/%s', 'files', $path),
        ]);

        return (string) $this->s3Client->createPresignedRequest($command, $duration)->getUri();
    }

    public function getOperator(): FilesystemOperator
    {
        return $this->filesStorage;
    }
}
