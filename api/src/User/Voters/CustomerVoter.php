<?php

declare(strict_types=1);

namespace App\User\Voters;

use App\Entity\User;
use App\Repository\AppointmentRepository;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

class CustomerVoter extends Voter
{
    public function __construct(
        private readonly Security $security,
        private readonly AppointmentRepository $appointmentRepository,
    ) {
    }

    protected function supports(string $attribute, mixed $subject): bool
    {
        return 'CUSTOMER_READ' === $attribute && $subject instanceof User;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        /** @var User|null $currentUser */
        $currentUser = $this->security->getUser();

        if (!$currentUser || !$currentUser->repairer) {
            return false;
        }

        return (bool) $this->appointmentRepository->findOneBy(['repairer' => $currentUser->repairer, 'customer' => $subject]);
    }
}
