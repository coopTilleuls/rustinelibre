<?php

declare(strict_types=1);

namespace App\Medias\Serializer;

use App\Entity\MediaObject;
use App\Flysystem\FileManager;
use App\Flysystem\ImageManager;
use League\Flysystem\FilesystemOperator;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class MediaObjectNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'MEDIA_OBJECT_NORMALIZER_ALREADY_CALLED';
    private const VIEWABLE_MIME_TYPES = [
        'image/png',
        'image/jpeg',
    ];

    public function __construct(
        private ImageManager $imageManager,
        private FileManager $fileManager,
        private FilesystemOperator $defaultStorage,
        private KernelInterface $kernel,
    ) {
    }

    /**
     * @param MediaObject $object
     */
    public function normalize($object, string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $context[self::ALREADY_CALLED] = true;

        if ('test' === $this->kernel->getEnvironment()) {
            if ($this->defaultStorage->has($object->filePath)) {
                $object->contentUrl = sprintf(
                    '%s/%s',
                    __DIR__.'../../../public/media',
                    $object->filePath
                );
            }
        } else {
            $object = $this->fillMediaObject($object);
        }

        return $this->normalizer->normalize($object, $format, $context);
    }

    private function fillMediaObject(MediaObject $mediaObject): MediaObject
    {
        if ($this->imageManager->getOperator()->fileExists($mediaObject->filePath)) {
            $manager = $this->imageManager;
        } elseif ($this->fileManager->getOperator()->fileExists($mediaObject->filePath)) {
            $manager = $this->fileManager;
        } else {
            return $mediaObject;
        }

        $operator = $manager->getOperator();
        $mediaObject->contentUrl = 'public' === $operator->visibility($mediaObject->filePath) ?
            $operator->publicUrl($mediaObject->filePath) :
            $manager->getPreSignedUrl($mediaObject->filePath);
        $mediaObject->viewable = in_array($operator->mimeType($mediaObject->filePath), self::VIEWABLE_MIME_TYPES, true);

        return $mediaObject;
    }

    public function supportsNormalization($data, string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof MediaObject;
    }
}
