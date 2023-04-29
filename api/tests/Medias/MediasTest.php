<?php

declare(strict_types=1);

namespace App\Tests\Medias;

use App\Entity\MediaObject;
use App\Tests\AbstractTestCase;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class MediasTest extends AbstractTestCase
{
    public const IMAGE_NAME = 'ratpi.png';

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
        $this->assertResponseIsSuccessful();
        $this->assertMatchesResourceItemJsonSchema(MediaObject::class);

        $dirPublicPath = sprintf('%s/../../public', __DIR__);

        // Check file exist
        $this->assertDirectoryExists($dirPublicPath);
        $this->assertFileExists(sprintf('%s%s', $dirPublicPath, $response->toArray()['contentUrl']));
    }
}
