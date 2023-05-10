<?php

declare(strict_types=1);

namespace App\Appointments\StateProvider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Appointments\Services\AvailableSlotComputer;
use App\Entity\RepairerAvailability;
use App\Repository\RepairerAvailabilityRepository;
use App\Repository\RepairerRepository;
use Recurr\Recurrence;
use Recurr\Rule;
use Recurr\Transformer\ArrayTransformer;
use Recurr\Transformer\ArrayTransformerConfig;
use Recurr\Transformer\Constraint\BetweenConstraint;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * @template-implements ProviderInterface<Operation>
 */
final class RepairerAvailableSlotsProvider implements ProviderInterface
{
    public function __construct(private AvailableSlotComputer $availableSlotComputer,
                                private RepairerRepository $repairerRepository,
                                private RepairerAvailabilityRepository $repairerAvailabilityRepository)
    {
    }

    /**
     * @return array<int, Recurrence>
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): array
    {
        $repairer = $this->repairerRepository->find($uriVariables['id']);

        if (!$repairer) {
            throw new NotFoundHttpException(sprintf('This repairer id (%s) does not exist', $uriVariables['id']));
        }

        // Get current day abbreviation
        $currentDay = strtoupper(substr(date('D'), 0, 2));

        // Build an array of 7 next days
        $days = [];
        $days[] = $currentDay;


        // Get current date after next hour
        $now = new \DateTime();
        $now = $now->setTime((int) $now->format('G'), 0);

        // Build array of next 7 days
        $currentDate = clone($now);
        for ($i = 1; $i <= 6; $i++) {
            $date = $currentDate->modify("+1 day");
            $day = strtoupper(substr($date->format("D"), 0, 2));
            $days[] = $day;
        }

        // Get next week date
        $nextWeek = clone($now);
        $nextWeek->modify('+1 week');

        // Instantiate a new array to provide all slots available for each day
        $slotsByDays = [];
        foreach ($days as $day) {

            /** @var RepairerAvailability[] $repairerAvailabilitiesByDay */
            $repairerAvailabilitiesByDay = $this->repairerAvailabilityRepository->findBy(['repairer' => $repairer, 'day' => $day]);

            $recurrencesData = [];
            foreach ($repairerAvailabilitiesByDay as $repairerAvailability) {


                $rrule = sprintf('FREQ=MINUTELY;BYDAY=%s;BYHOUR=%s;DURATION=PT%sM;%s', $repairerAvailability->day, $this->buildByHourRrule($repairerAvailability), $repairer->durationSlot ?? '60', $this->buildByMinutes($repairerAvailability));
                // $rrule = $this->isHalfAnHour($repairerAvailability) ? sprintf('%sBYMINUTE=30', $rrule) : $rrule;
                $rule = new Rule($rrule);
                $rule->setStartDate($now);
                $rule->setEndDate($nextWeek);

                $recurrences = (new ArrayTransformer(new ArrayTransformerConfig()))->transform(
                    $rule,
                    new BetweenConstraint($now, $nextWeek)
                );

                $recurrencesData[] = $recurrences->toArray();
            }


            // dump($recurrences->toArray());die;

            $slotsByDays[$day] = $recurrencesData;
        }


        dump($slotsByDays);
        die;



        die;
    }

    private function buildByHourRrule(RepairerAvailability $repairerAvailability): string
    {
        $startTime = new \DateTimeImmutable($repairerAvailability->startTime);
        $endTime = new \DateTimeImmutable($repairerAvailability->endTime);

        $hours = [];
        while ($startTime < $endTime) {
            $hours[] = $startTime->format('G');
            $startTime = $startTime->modify('+1 hour');
        }

        return implode(',', $hours);
    }

    private function buildByMinutes(RepairerAvailability $repairerAvailability): string
    {
        $partsStart = explode(':', $repairerAvailability->startTime);
        $hourStartMinutes = $partsStart[1];

        if ('00' !== $hourStartMinutes) {
            return 'BYMINUTE=30';
        }

        return '';
    }
}
