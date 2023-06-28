<?php

declare(strict_types=1);

namespace App\Appointments\Serializer;

use App\Entity\Appointment;
use App\Messages\Helpers\DiscussionManager;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class AppointmentDiscussionNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'APPOINTMENT_NORMALIZER_ALREADY_CALLED';

    public function __construct(private readonly DiscussionManager $discussionManager)
    {
    }

    /**
     * @param Appointment $object
     */
    public function normalize($object, string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $context[self::ALREADY_CALLED] = true;

        $discussion = $this->discussionManager->getOrCreateDiscussion($object);
        $object->discussion = $discussion;

        return $this->normalizer->normalize($object, $format, $context);
    }

    public function supportsNormalization($data, string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Appointment;
    }
}
