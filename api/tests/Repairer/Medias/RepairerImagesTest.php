<?php

declare(strict_types=1);

namespace App\Tests\Repairer\Medias;

use App\Tests\AbstractTestCase;
use App\Tests\Medias\MediasTest;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class RepairerImagesTest extends AbstractTestCase
{
    public function testAddImageToRepairer(): void
    {
        $file = new UploadedFile(sprintf('%s/../../../fixtures/%s', __DIR__, MediasTest::IMAGE_NAME), MediasTest::IMAGE_NAME);

        $response = $this->createClientAuthAsAdmin()->request('POST', '/media_objects', [
            'headers' => ['Content-Type' => 'multipart/form-data'],
            'extra' => [
                'files' => [
                    'file' => $file,
                ],
            ],
        ]);

        $this->assertResponseIsSuccessful();
        $imageIri = $response->toArray()['@id'];

        $responseRepairer = $this->createClientAuthAsAdmin()->request('PUT', '/repairers/3', ['json' => [
            'thumbnail' => $imageIri,
            'descriptionPicture' => $imageIri,
        ]]);

        $responseDataUpdate = $responseRepairer->toArray();
        $this->assertIsString($responseDataUpdate['thumbnail']);
        $this->assertIsString($responseDataUpdate['descriptionPicture']);
    }
}
