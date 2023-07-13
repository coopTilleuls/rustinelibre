<?php

declare(strict_types=1);

namespace App\Repairers\Serializer;

use App\Entity\Repairer;
use App\Repository\RepairerRepository;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class RepairerNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'REPAIRER_NORMALIZER_ALREADY_CALLED';

    public function __construct(private readonly RepairerRepository $repairerRepository,
        private readonly RequestStack $requestStack)
    {
    }

    /**
     * @param Repairer $object
     */
    public function normalize($object, string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $context[self::ALREADY_CALLED] = true;

        if ($this->requestStack->getCurrentRequest() && $this->requestStack->getCurrentRequest()->query->has('around')) {
            $coordinates = explode(',', reset($this->requestStack->getCurrentRequest()->query->all()['around']));
            $distance = $this->repairerRepository->calculateDistanceBetweenRepairerAndCoordinates(repairer: $object, latitude: $coordinates[0], longitude: $coordinates[1]);
            $object->distance = $distance;
        }

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization($data, string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Repairer;
    }
}
