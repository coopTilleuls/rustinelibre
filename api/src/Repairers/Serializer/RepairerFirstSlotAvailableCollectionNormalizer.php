<?php

declare(strict_types=1);

namespace App\Repairers\Serializer;

use ApiPlatform\Metadata\GetCollection;
use App\Appointments\Services\AvailableSlotComputer;
use App\Entity\Repairer;
use App\Repository\RepairerRepository;
use Recurr\Recurrence;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\NormalizerAwareTrait;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;

class RepairerFirstSlotAvailableCollectionNormalizer implements NormalizerInterface, NormalizerAwareInterface
{
    use NormalizerAwareTrait;

    private bool $ready = true;
    private ?Request $request;

    public function __construct(private AvailableSlotComputer $availableSlotComputer, private RequestStack $requestStack, private RepairerRepository $repairerRepository)
    {
        $this->request = $this->requestStack->getCurrentRequest();
    }

    /**
     * {@inheritdoc}
     */
    public function normalize($object, $format = null, array $context = []): ?array
    {
        $this->ready = false;

        /** @var array $data */
        $data = $this->normalizer->normalize($object, $format, $context);

        if (!$this->request->query->has('order') ||
            !array_key_exists('firstSlotAvailable', $orderFirstSlot = $this->request->get('order')) ||
            empty($data['hydra:member'])
        ) {
            return $data;
        }

        foreach ($collection = $data['hydra:member'] as $key => $repairerDatum) {
            $repairer = $this->repairerRepository->find($repairerDatum['id']);
            /** @var array<int, Recurrence> $slotsAvailable */
            $slotsAvailable = $this->availableSlotComputer->computeAvailableSlotsByRepairer($repairer, new \DateTimeImmutable(), new \DateTimeImmutable('+1 month'));
            if (!empty($slotsAvailable)) {
                $collection[$key]['firstSlotAvailable'] = array_shift($slotsAvailable)->getStart();
            } else {
                $collection[$key]['firstSlotAvailable'] = null;
            }
        }

        // Don't order if less than 2 results
        if (1 < count($collection)) {
            $keyValues = array_column($collection, 'firstSlotAvailable');
            if ('asc' === $orderFirstSlot['firstSlotAvailable']) {
                array_multisort($keyValues, SORT_ASC, $collection);
            } else {
                array_multisort($keyValues, SORT_DESC, $collection);
            }
        }

        $data['hydra:member'] = $collection;
        $this->ready = true;

        return $data;
    }

    /**
     * {@inheritdoc}
     */
    public function supportsNormalization($data, $format = null, array $context = []): bool
    {
        return array_key_exists('operation', $context) && $context['operation'] instanceof GetCollection && Repairer::class === $context['resource_class'] && $this->ready;
    }
}
