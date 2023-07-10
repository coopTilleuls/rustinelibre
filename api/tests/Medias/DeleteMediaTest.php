<?php

declare(strict_types=1);

namespace App\Tests\Medias;

use App\Repository\BikeRepository;
use App\Repository\MaintenanceRepository;
use App\Repository\MediaObjectRepository;
use App\Tests\AbstractTestCase;
use League\Flysystem\FilesystemOperator;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;

class DeleteMediaTest extends AbstractTestCase
{
    private FilesystemOperator $imagesStorage;

    private MediaObjectRepository $mediaObjectRepository;

    public function setUp(): void
    {
        parent::setUp();
        $this->imagesStorage = self::getContainer()->get('images.storage');
        $this->mediaObjectRepository = self::getContainer()->get(MediaObjectRepository::class);
    }

    public function testFileRemoveIfMediaDeleted(): void
    {
        $file = new UploadedFile(sprintf('%s/../../fixtures/%s', __DIR__, MediasTest::IMAGE_NAME), MediasTest::IMAGE_NAME);
        $response = $this->createClientAuthAsAdmin()->request('POST', '/media_objects/images', [
            'headers' => ['Content-Type' => 'multipart/form-data'],
            'extra' => [
                'files' => [
                    'file' => $file,
                ],
            ],
        ]);
        self::assertResponseIsSuccessful();

        $this->mediaObjectRepository = self::getContainer()->get(MediaObjectRepository::class);
        $filePath = $this->mediaObjectRepository->find(basename($response->toArray()['@id']))->filePath;

        // Check file exist
        $this->assertTrue($this->imagesStorage->has($filePath));

        // Remove media object resource
        $this->createClientAuthAsAdmin()->request('DELETE', $response->toArray()['@id']);

        // Check file does not exist
        $this->assertFalse($this->imagesStorage->has($filePath));
    }

    public function testMediaRemoveIfBikeRemove(): void
    {
        $file = new UploadedFile(sprintf('%s/../../fixtures/%s', __DIR__, MediasTest::IMAGE_NAME), MediasTest::IMAGE_NAME);
        $mediaResponse = $this->createClientAuthAsAdmin()->request('POST', '/media_objects/images', [
            'headers' => ['Content-Type' => 'multipart/form-data'],
            'extra' => [
                'files' => [
                    'file' => $file,
                ],
            ],
        ]);
        self::assertResponseIsSuccessful();

        // Check file exist
        $this->mediaObjectRepository = self::getContainer()->get(MediaObjectRepository::class);
        $filePath = $this->mediaObjectRepository->find(basename($mediaResponse->toArray()['@id']))->filePath;
        $this->assertTrue($this->imagesStorage->has($filePath));

        // Update a random bike with new picture
        $randomBike = self::getContainer()->get(BikeRepository::class)->findOneBy([]);
        $bikeResponse = $this->createClientAuthAsAdmin()->request('PUT', sprintf('/bikes/%d', $randomBike->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'picture' => $mediaResponse->toArray()['@id'],
            ],
        ]);
        self::assertResponseIsSuccessful();

        // Delete bike
        $this->createClientAuthAsAdmin()->request('DELETE', $bikeResponse->toArray()['@id']);
        self::assertResponseIsSuccessful();

        // Media should not exist
        $this->createClientAuthAsAdmin()->request('GET', $mediaResponse->toArray()['@id']);
        self::assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);

        // File should not exist
        $this->assertFalse($this->imagesStorage->has($filePath));
    }

    public function testMediaRemoveIfMaintenanceRemove(): void
    {
        $file = new UploadedFile(sprintf('%s/../../fixtures/%s', __DIR__, MediasTest::IMAGE_NAME), MediasTest::IMAGE_NAME);
        $mediaResponse = $this->createClientAuthAsAdmin()->request('POST', '/media_objects/images', [
            'headers' => ['Content-Type' => 'multipart/form-data'],
            'extra' => [
                'files' => [
                    'file' => $file,
                ],
            ],
        ]);
        self::assertResponseIsSuccessful();

        // Check file exist
        $this->mediaObjectRepository = self::getContainer()->get(MediaObjectRepository::class);
        $filePath = $this->mediaObjectRepository->find(basename($mediaResponse->toArray()['@id']))->filePath;
        $this->assertTrue($this->imagesStorage->has($filePath));

        // Update a random maintenance with new picture
        $randomMaintenance = self::getContainer()->get(MaintenanceRepository::class)->findOneBy([]);
        $maintenanceResponse = $this->createClientAuthAsAdmin()->request('PUT', sprintf('/maintenances/%d', $randomMaintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'photo' => $mediaResponse->toArray()['@id'],
            ],
        ]);
        self::assertResponseIsSuccessful();

        // Delete bike
        $this->createClientAuthAsAdmin()->request('DELETE', $maintenanceResponse->toArray()['@id']);
        self::assertResponseIsSuccessful();

        // Media should not exist
        $this->createClientAuthAsAdmin()->request('GET', $mediaResponse->toArray()['@id']);
        self::assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);

        // File should not exist
        $this->assertFalse($this->imagesStorage->has($filePath));
    }
}
