<?php

declare(strict_types=1);

namespace App\Messages\Helpers;

use App\Entity\Appointment;
use App\Entity\Discussion;
use App\Repository\DiscussionRepository;

readonly class DiscussionManager
{
    public function __construct(private DiscussionRepository $discussionRepository)
    {
    }

    public function getOrCreateDiscussion(Appointment $appointment): Discussion
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
}
