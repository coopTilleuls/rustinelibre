<?php

declare(strict_types=1);

namespace App\Appointments\Voters;

use App\Entity\Appointment;
use App\Repairers\Slots\ComputeAvailableSlotsByRepairer;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class AppointmentAvailableSlotVoter extends Voter
{
    public function __construct(
        private readonly RequestStack $requestStack,
        private readonly Security $security,
        private readonly ComputeAvailableSlotsByRepairer $computeAvailableSlotsByRepairer
    ) {
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return 'AVAILABLE_SLOT' === $attribute && $subject instanceof Appointment;
    }

    /*
     * @param Appointment $subject
     */
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $this->security->getUser();

        if (!$user || !in_array($this->requestStack->getCurrentRequest()?->getMethod(), [Request::METHOD_PUT, Request::METHOD_POST], true)) {
            return false;
        }

        $slots = $this->computeAvailableSlotsByRepairer->buildArrayOfAvailableSlots($subject->repairer);

        return array_key_exists($subject->slotTime->format('Y-m-d'), $slots) && in_array($subject->slotTime->format('H:i'), $slots[$subject->slotTime->format('Y-m-d')], true);
    }
}
