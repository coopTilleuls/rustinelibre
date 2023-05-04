<?php

declare(strict_types=1);

namespace App\Appointments\Voters;

use App\Entity\Appointment;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class AppointmentAcceptedVoter extends Voter
{
    public function __construct(
        private readonly Security $security,
        private readonly RequestStack $requestStack,
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
        /** @var ?User $currentUser */
        $currentUser = $token->getUser();

        if(!$currentUser || $this->requestStack->getCurrentRequest()?->getMethod() !== Request::METHOD_PUT) {
            return false;
        }

        return $subject->repairer->owner === $currentUser || $this->security->isGranted('ROLE_ADMIN');
    }
}
