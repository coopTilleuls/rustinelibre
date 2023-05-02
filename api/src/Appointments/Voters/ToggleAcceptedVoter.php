<?php

declare(strict_types=1);

namespace App\Appointments\Voters;

use App\Entity\Appointment;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class ToggleAcceptedVoter extends Voter
{
    public function __construct(
        private readonly RequestStack $requestStack,
        private readonly Security $security,
    ) {
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return 'APPOINTMENT_EDIT' === $attribute
            && $subject instanceof Appointment;
    }

    /*
     * @param Appointment $subject
     */
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        if ('APPOINTMENT_EDIT' === $attribute) {
            $content = json_decode($this->requestStack->getCurrentRequest()?->getContent(), true, 512, JSON_THROW_ON_ERROR);
            if (isset($content['accepted']) && ($this->security->getUser() === $subject->repairer->owner || $this->security->isGranted('ROLE_ADMIN'))) {
                return true;
            }
        }

        return false;
    }
}
