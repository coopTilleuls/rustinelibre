<?php

namespace App\Appointments\Services;

use App\Entity\Location;
use App\Repository\AppointmentRepository;
use Recurr\Recurrence;
use Recurr\Rule;
use Recurr\Transformer\ArrayTransformer;
use Recurr\Transformer\ArrayTransformerConfig;
use Recurr\Transformer\Constraint\BetweenConstraint;

final class AvailableSlotComputer
{
    public function __construct(private AppointmentRepository $appointmentRepository)
    {
    }

    public function computeAvailableSlotsByLocation(Location $location, \DateTimeInterface $startDate, \DateTimeInterface $endDate): array
    {
        if ($startDate > $endDate || $startDate->diff($endDate)->days > 31) {
            throw new \InvalidArgumentException(sprintf('Invalid date range %s - %s (1 month max).', $startDate->format(\DateTime::ATOM), $endDate->format(\DateTime::ATOM)));
        }

        $rule = new Rule($location->getRrule());
        $rule->setStartDate($startDate);
        $rule->setEndDate($endDate);

        $fullSlots = $this->appointmentRepository->findFullSlots($location, $startDate, $endDate);
        $recurrences = (new ArrayTransformer(new ArrayTransformerConfig()))->transform(
            $rule,
            new BetweenConstraint($startDate, $endDate)
        );

        return array_filter($recurrences->toArray(), function (Recurrence $r) use ($fullSlots) {
            $start = $r->getStart();

            // dump($start);
            // dump($fullSlots);
            // dump(in_array($start, $fullSlots, false));
            // die;
            return !\in_array($start, $fullSlots, false);
        });
    }
}
