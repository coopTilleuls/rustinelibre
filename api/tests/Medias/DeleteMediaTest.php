<?php

declare(strict_types=1);

namespace App\Tests\Medias;

use App\Repository\BikeRepository;
use App\Repository\MaintenanceRepository;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\Response;

class DeleteMediaTest extends AbstractTestCase
{
    public function testFileRemoveIfMediaDeleted(): void
    {
        $file = new UploadedFile(sprintf('%s/../../fixtures/%s', __DIR__, MediasTest::IMAGE_NAME), MediasTest::IMAGE_NAME);

        $response = $this->createClientAuthAsAdmin()->request('POST', '/media_objects', [
            'headers' => ['Content-Type' => 'multipart/form-data'],
            'extra' => [
                'files' => [
                    'file' => $file,
                ],
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $dirPublicPath = sprintf('%s/../../public', __DIR__);
        $this->assertDirectoryExists($dirPublicPath);

        // Check file exist
        $this->assertFileExists(sprintf('%s%s', $dirPublicPath, $response->toArray()['contentUrl']));

        // Remove media object resource
        $this->createClientAuthAsAdmin()->request('DELETE', $response->toArray()['@id']);

        // Check file does not exist
        $this->assertFileDoesNotExist(sprintf('%s%s', $dirPublicPath, $response->toArray()['contentUrl']));
    }

    public function testMediaRemoveIfBikeRemove(): void
    {
        $dirPublicPath = sprintf('%s/../../public', __DIR__);
        $file = new UploadedFile(sprintf('%s/../../fixtures/%s', __DIR__, MediasTest::IMAGE_NAME), MediasTest::IMAGE_NAME);

        $mediaResponse = $this->createClientAuthAsAdmin()->request('POST', '/media_objects', [
            'headers' => ['Content-Type' => 'multipart/form-data'],
            'extra' => [
                'files' => [
                    'file' => $file,
                ],
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Update a random bike with new picture
        $randomBike = self::getContainer()->get(BikeRepository::class)->findOneBy([]);
        $bikeResponse = $this->createClientAuthAsAdmin()->request('PUT', sprintf('/bikes/%d', $randomBike->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'picture' => $mediaResponse->toArray()['@id'],
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Delete bike
        $this->createClientAuthAsAdmin()->request('DELETE', $bikeResponse->toArray()['@id']);
        $this->assertResponseIsSuccessful();

        // Media should not exist
        $this->createClientAuthAsAdmin()->request('GET', $mediaResponse->toArray()['@id']);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);

        // File should not exist
        $this->assertFileDoesNotExist(sprintf('%s%s', $dirPublicPath, $mediaResponse->toArray()['contentUrl']));
    }

    public function testMediaRemoveIfMaintenanceRemove(): void
    {
        $dirPublicPath = sprintf('%s/../../public', __DIR__);
        $file = new UploadedFile(sprintf('%s/../../fixtures/%s', __DIR__, MediasTest::IMAGE_NAME), MediasTest::IMAGE_NAME);

        $mediaResponse = $this->createClientAuthAsAdmin()->request('POST', '/media_objects', [
            'headers' => ['Content-Type' => 'multipart/form-data'],
            'extra' => [
                'files' => [
                    'file' => $file,
                ],
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Update a random maintenance with new picture
        $randomMaintenance = self::getContainer()->get(MaintenanceRepository::class)->findOneBy([]);
        $maintenanceResponse = $this->createClientAuthAsAdmin()->request('PUT', sprintf('/maintenances/%d', $randomMaintenance->id), [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'photo' => $mediaResponse->toArray()['@id'],
            ],
        ]);
        $this->assertResponseIsSuccessful();

        // Delete bike
        $this->createClientAuthAsAdmin()->request('DELETE', $maintenanceResponse->toArray()['@id']);
        $this->assertResponseIsSuccessful();

        // Media should not exist
        $this->createClientAuthAsAdmin()->request('GET', $mediaResponse->toArray()['@id']);
        $this->assertResponseStatusCodeSame(Response::HTTP_NOT_FOUND);

        // File should not exist
        $this->assertFileDoesNotExist(sprintf('%s%s', $dirPublicPath, $mediaResponse->toArray()['contentUrl']));
    }
}
