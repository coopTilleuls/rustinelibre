<?php

declare(strict_types=1);

namespace App\Medias\Serializer;

use App\Entity\MediaObject;
use League\Flysystem\FilesystemOperator;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class MediaObjectNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'MEDIA_OBJECT_NORMALIZER_ALREADY_CALLED';

    public function __construct(
        private FilesystemOperator $imagesStorage
    ) {
    }

    public function normalize($object, string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $context[self::ALREADY_CALLED] = true;

        if ($this->imagesStorage->fileExists($object->filePath)) {
            $object->contentUrl = $this->imagesStorage->publicUrl($object->filePath);
        }

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization($data, string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof MediaObject;
    }
}
