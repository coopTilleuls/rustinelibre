<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Entity\DiscussionMessage;
use App\Entity\User;

final readonly class NewMessageNotification
{
    public function __construct(private FirebaseNotifier $firebaseNotifier)
    {
    }

    public function sendNewMessageNotification(DiscussionMessage $message): void
    {
        $notification = new Notification(
            recipient: $this->getRecipient($message),
            title: 'Nouveau message',
            body: $this->buildMessage($message),
            params: [
                'route' => (!$message->sender->isBoss() && !$message->sender->isEmployee()) ? '/sradmin/messagerie' : '/messagerie',
            ]
        );

        $this->firebaseNotifier->sendNotification(notification: $notification);
    }

    private function buildMessage(DiscussionMessage $message): string
    {
        return sprintf('Nouveau message de %s : %s...', $message->sender->__toString(), substr($message->content, 0, 10));
    }

    private function getRecipient(DiscussionMessage $message): User
    {
        if ($message->sender === $message->discussion->customer) {
            return $message->discussion->repairer->owner;
        }

        return $message->discussion->customer;
    }
}
