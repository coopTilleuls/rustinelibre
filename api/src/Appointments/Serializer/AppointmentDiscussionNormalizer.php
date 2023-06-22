<?php

declare(strict_types=1);

namespace App\Appointments\Serializer;

use App\Entity\Appointment;
use App\Entity\Discussion;
use App\Repository\DiscussionRepository;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

final class AppointmentDiscussionNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private const ALREADY_CALLED = 'APPOINTMENT_NORMALIZER_ALREADY_CALLED';

    public function __construct(private readonly DiscussionRepository $discussionRepository)
    {
    }

    /**
     * @param Appointment $object
     */
    public function normalize($object, ?string $format = null, array $context = []): array|string|int|float|bool|\ArrayObject|null
    {
        $context[self::ALREADY_CALLED] = true;

        $discussion = $this->getOrCreateDiscussion($object);
        $object->discussion = $discussion;

        return $this->normalizer->normalize($object, $format, $context);
    }

    private function getOrCreateDiscussion(Appointment $appointment): Discussion
    {
        $discussion = $this->discussionRepository->findOneBy(['repairer' => $appointment->repairer, 'customer' => $appointment->customer]);

        if (!$discussion) {
            $discussion = new Discussion();
            $discussion->repairer = $appointment->repairer;
            $discussion->customer = $appointment->customer;
            $this->discussionRepository->save($discussion, true);
        }

        return $discussion;
    }

    public function supportsNormalization($data, ?string $format = null, array $context = []): bool
    {
        if (isset($context[self::ALREADY_CALLED])) {
            return false;
        }

        return $data instanceof Appointment;
    }
}
