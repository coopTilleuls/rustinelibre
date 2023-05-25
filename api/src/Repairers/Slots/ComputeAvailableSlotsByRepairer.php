<?php

declare(strict_types=1);

namespace App\Repairers\Slots;

use App\Entity\Repairer;
use App\Entity\RepairerExceptionalClosure;
use App\Entity\RepairerOpeningHours;
use App\Repository\AppointmentRepository;
use App\Repository\RepairerExceptionalClosureRepository;
use App\Repository\RepairerOpeningHoursRepository;
use Spatie\OpeningHours\OpeningHours;
use Spatie\OpeningHours\TimeRange;

final class ComputeAvailableSlotsByRepairer
{
    public function __construct(private RepairerOpeningHoursRepository $repairerOpeningHoursRepository,
                                private AppointmentRepository $appointmentRepository,
                                private RepairerExceptionalClosureRepository $repairerExceptionalClosureRepository)
    {
    }

    public function buildArrayOfAvailableSlots(Repairer $repairer): array
    {
        // Get next 60 default slots
        $next60DaysSlots = $this->get60NextDaysSLots($repairer);

        // Clean the slots of exceptional closures
        $slotsNoExceptionalClosure = $this->removeExceptionDays($repairer, $next60DaysSlots);

        // Remove appointments from slots
        $slotsNotFull = $this->removeAppointments($repairer, $slotsNoExceptionalClosure);

        return $slotsNotFull;
    }

    private function removeExceptionDays(Repairer $repairer, array $slots): array
    {
        /** @var RepairerExceptionalClosure[] $exeptionalClosures */
        $exeptionalClosures = $this->repairerExceptionalClosureRepository->findExceptionalClosureByRepairerBetweenDates($repairer);

        if (empty($exeptionalClosures)) {
            return $slots;
        }

        foreach ($slots as $day => $openingHours) {
            $dayDate = new \DateTime($day);

            foreach ($exeptionalClosures as $exeptionalClosure) {
                $startDate = $exeptionalClosure->startDate->format('Y-m-d');
                $endDate = $exeptionalClosure->endDate->format('Y-m-d');
                $dayFormatted = $dayDate->format('Y-m-d');
                if ($dayFormatted >= $startDate && $dayFormatted <= $endDate) {
                    unset($slots[$day]);
                }
            }
        }

        return $slots;
    }

    private function removeAppointments(Repairer $repairer, array $slots): array
    {
        $appointments = $this->appointmentRepository->findFullSlots($repairer);

        if (empty($appointments)) {
            return $slots;
        }

        /** @var \DateTimeImmutable $appointment */
        foreach ($appointments as $appointment) {
            $appointmentDay = $appointment->format('Y-m-d');
            if (array_key_exists($appointmentDay, $slots)) {
                $slotTime = $appointment->format('H:i');
                if (in_array($slotTime, $slots[$appointmentDay], true)) {
                    $key = array_search($slotTime, $slots[$appointmentDay], true);
                    if (false !== $key) {
                        unset($slots[$appointmentDay][$key]);
                        $slots[$appointmentDay] = array_values($slots[$appointmentDay]);
                    }
                }
            }
        }

        return $slots;
    }

    private function get60NextDaysSLots(Repairer $repairer): array
    {
        $next60days = $this->get60nextDates();
        $openingHoursData = [];

        $availabilitiesByDays = $this->repairerOpeningHoursRepository->findRepairerAvailabilitiesGroupByDay($repairer);

        // Loop on each day of week to get the opening hours from the given repairer
        foreach (RepairerOpeningHours::DAYS_OF_WEEK as $dayOfWeek) {
            // No opening hours available for this day
            if (!array_key_exists($dayOfWeek, $availabilitiesByDays)) {
                $openingHoursData[$dayOfWeek] = [];
                continue;
            }

            $openingHoursFromDay = [];
            foreach ($availabilitiesByDays[$dayOfWeek] as $repairerAvailability) {
                $openingHoursFromDay[] = sprintf('%s-%s', $repairerAvailability['startTime'], $repairerAvailability['endTime']);
            }

            $openingHoursData[$dayOfWeek] = $openingHoursFromDay;
        }

        $openingHours = OpeningHours::create(OpeningHours::mergeOverlappingRanges($openingHoursData));

        //  Build slots by day
        $data = [];
        foreach ($next60days as $day) {
            $dateByDay = new \DateTime($day);
            $openingHoursForDay = $openingHours->forDate($dateByDay);

            /** @var TimeRange $timeRange */
            foreach ($openingHoursForDay as $timeRange) {
                // Get end of the time range
                $endTimeRange = clone $dateByDay;
                $endTimeRange = $endTimeRange->setTime($timeRange->end()->hours(), $timeRange->end()->minutes());

                // Get the first slot available of the day
                $slot = clone $dateByDay;
                $slot = $slot->setTime($timeRange->start()->hours(), $timeRange->start()->minutes());

                // Add slots until the time range stop
                while ($slot < $endTimeRange) {
                    if (new \DateTime() < $slot) {
                        $data[$day][] = $slot->format('H:i');
                    }
                    $slot->modify(sprintf('+%s minutes', $repairer->durationSlot ?? '60'));
                }
            }
        }

        return $data;
    }

    private function get60nextDates(): array
    {
        $startDate = new \DateTime();
        $endDate = new \DateTime();
        $endDate->add(new \DateInterval('P60D'));

        $dates = [];
        for ($date = $startDate; $date <= $endDate; $date->add(new \DateInterval('P1D'))) {
            $dates[] = $date->format('Y-m-d');
        }

        return $dates;
    }
}
