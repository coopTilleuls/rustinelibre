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

        $this->createClientAuthAsAdmin()->request('POST', '/media_objects', [
            'headers' => ['Content-Type' => 'multipart/form-data'],
            'extra' => [
                'files' => [
                    'file' => $file,
                ],
            ],
        ]);
        $this->assertResponseIsSuccessful();
        $this->assertMatchesResourceItemJsonSchema(MediaObject::class);

        $dirPath = sprintf('%s/../../public/medias', __DIR__);
        $this->assertDirectoryExists($dirPath);
        $this->assertTrue($this->checkFileNameExistInDir($dirPath, self::IMAGE_NAME));
    }

    private function checkFileNameExistInDir(string $dir, string $filename): bool
    {
        $files = scandir($dir);
        foreach ($files as $file) {
            if (str_contains($file, $filename)) {
                return true;
            }
        }

        return false;
    }
}
