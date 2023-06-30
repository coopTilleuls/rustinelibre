<?php

declare(strict_types=1);

namespace App\Medias\Serializer;

use App\Entity\MediaObject;
use App\Flysystem\ImageManager;
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
    ) {
    }

    /**
     * @param MediaObject $object
     */
    public function normalize($object, string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $context[self::ALREADY_CALLED] = true;
        $operator = $this->imageManager->getOperator();

        if ($operator->fileExists($object->filePath)) {
            $object->contentUrl = 'public' === $operator->visibility($object->filePath) ?
                $operator->publicUrl($object->filePath) :
                $this->imageManager->getPreSignedUrl($object->filePath);
            $object->viewable = in_array($operator->mimeType($object->filePath), self::VIEWABLE_MIME_TYPES);
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
