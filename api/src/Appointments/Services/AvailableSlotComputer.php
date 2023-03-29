<?php

declare(strict_types=1);

namespace App\Appointments\Services;

use App\Entity\Repairer;
use App\Repository\AppointmentRepository;
use Recurr\Recurrence;
use Recurr\Rule;
use Recurr\Transformer\ArrayTransformer;
use Recurr\Transformer\ArrayTransformerConfig;
use Recurr\Transformer\Constraint\BetweenConstraint;

final class AvailableSlotComputer
{
    public function __construct(private readonly AppointmentRepository $appointmentRepository)
    {
    }

    /**
     * @return array<int, Recurrence>
     */
    public function computeAvailableSlotsByRepairer(Repairer $repairer, \DateTimeInterface $startDate, \DateTimeInterface $endDate): array
    {
        if ($startDate > $endDate || $startDate->diff($endDate)->days > 31) {
            throw new \InvalidArgumentException(sprintf('Invalid date range %s - %s (1 month max).', $startDate->format(\DateTime::ATOM), $endDate->format(\DateTime::ATOM)));
        }

        // Set available slots from next hour
        $startDate = $startDate->setTime((int) $startDate->format('G') + 1, 0);
        $endDate = $endDate->setTime((int) $endDate->format('G'), 0);

        $rule = new Rule($repairer->getRrule());
        $rule->setStartDate($startDate);
        $rule->setEndDate($endDate);

        $fullSlots = $repairer->getId() ? $this->appointmentRepository->findFullSlots($repairer, $startDate, $endDate) : [];
        $recurrences = (new ArrayTransformer(new ArrayTransformerConfig()))->transform(
            $rule,
            new BetweenConstraint($startDate, $endDate)
        );

        return array_filter($recurrences->toArray(), function (Recurrence $r) use ($fullSlots) {
            $start = $r->getStart();

            return !\in_array($start, $fullSlots, false);
        });
    }
}
