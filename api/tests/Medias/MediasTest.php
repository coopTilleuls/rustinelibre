<?php

declare(strict_types=1);

namespace App\Tests\Medias;

use App\Entity\MediaObject;
use App\Repository\MediaObjectRepository;
use App\Tests\AbstractTestCase;
use League\Flysystem\FilesystemOperator;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class MediasTest extends AbstractTestCase
{
    public const IMAGE_NAME = 'ratpi.png';

    private FilesystemOperator $defaultStorage;

    private MediaObjectRepository $mediaObjectRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->defaultStorage = self::getContainer()->get('default.storage');
        $this->mediaObjectRepository = self::getContainer()->get(MediaObjectRepository::class);
    }

    public function testCreateAMediaObject(): void
    {
        $file = new UploadedFile(sprintf('%s/../../fixtures/%s', __DIR__, self::IMAGE_NAME), self::IMAGE_NAME);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/media_objects', [
            'headers' => ['Content-Type' => 'multipart/form-data'],
            'extra' => [
                'files' => [
                    'file' => $file,
                ],
            ],
        ]);
        self::assertResponseIsSuccessful();
        self::assertMatchesResourceItemJsonSchema(MediaObject::class);

        // Check file exist
        $this->mediaObjectRepository = self::getContainer()->get(MediaObjectRepository::class);
        $filePath = $this->mediaObjectRepository->find(basename($response->toArray()['@id']))->filePath;
        self::assertTrue($this->defaultStorage->has($filePath));
    }
}
