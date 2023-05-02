<?php

declare(strict_types=1);

namespace App\Appointments\Voters;

use App\Entity\Appointment;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class AppointmentAcceptedVoter extends Voter
{
    public function __construct(
        private readonly Security $security,
    ) {
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return 'ACCEPTED_TOGGLE' === $attribute && $subject instanceof Appointment;
    }

    /*
     * @param Appointment $subject
     */
    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {

        /** @var User|null $currentUser */
        $currentUser = $token->getUser();
        if (!$currentUser || !$subject instanceof Appointment) {
            return false;
        }

        if ($subject->repairer->owner !== $currentUser || $this->security->isGranted('ROLE_ADMIN')) {
            return false;
        }

        // $content = json_decode($this->requestStack->getCurrentRequest()?->getContent(), true, 512, JSON_THROW_ON_ERROR);
        // if (isset($content['accepted']) && ($this->security->getUser() === $subject->repairer->owner || $this->security->isGranted('ROLE_ADMIN'))) {
        //     return true;
        // }

        return true;
    }
}
