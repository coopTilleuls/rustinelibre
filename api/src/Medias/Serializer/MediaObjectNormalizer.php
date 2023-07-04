<?php

declare(strict_types=1);

namespace App\Medias\Serializer;

use App\Entity\MediaObject;
use App\Flysystem\MediaObjectManager;
use Symfony\Component\HttpKernel\KernelInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class MediaObjectNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'MEDIA_OBJECT_NORMALIZER_ALREADY_CALLED';

    public function __construct(
        private readonly MediaObjectManager $mediaObjectManager,
        private readonly KernelInterface $kernel,
    ) {
    }

    /**
     * @param MediaObject $object
     */
    public function normalize($object, string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $context[self::ALREADY_CALLED] = true;

        $object = $this->fillMediaObject($object);

        return $this->normalizer->normalize($object, $format, $context);
    }

    private function fillMediaObject(MediaObject $mediaObject): MediaObject
    {
        $prefix = $this->mediaObjectManager->getPrefixOfMediaObject($mediaObject);
        if (!$prefix) {
            return $mediaObject;
        }

        $filePath = $mediaObject->filePath;
        $mediaObject->contentUrl = 'public' === $this->mediaObjectManager->visibility($filePath, $prefix) ?
            $this->mediaObjectManager->publicUrl($filePath, $prefix) :
            $this->mediaObjectManager->getPreSignedUrl($filePath, $prefix);
        $mediaObject->viewable = in_array($this->mediaObjectManager->getOperator($prefix)->mimeType($filePath), MediaObject::MIME_TYPE_IMAGE_ACCEPTED, true);

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
