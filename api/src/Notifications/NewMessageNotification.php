<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Entity\DiscussionMessage;
use App\Entity\RepairerEmployee;
use App\Entity\User;

final readonly class NewMessageNotification
{
    public function __construct(private FirebaseNotifier $firebaseNotifier)
    {
    }

    public function sendNewMessageNotification(DiscussionMessage $message): void
    {
        /** @var User[] $recipients */
        $recipients = $this->getRecipients($message);

        foreach ($recipients as $recipient) {
            $notification = new Notification(
                recipient: $recipient,
                title: 'Nouveau message',
                body: $this->buildMessage($message),
                params: [
                    'route' => (!$message->sender->isBoss() && !$message->sender->isEmployee()) ? '/sradmin/messagerie' : '/messagerie',
                ]
            );

            $this->firebaseNotifier->sendNotification(notification: $notification);
        }
    }

    private function buildMessage(DiscussionMessage $message): string
    {
        return sprintf('Nouveau message de %s : %s...', $message->sender->__toString(), substr($message->content, 0, 10));
    }

    private function getRecipients(DiscussionMessage $message): array
    {
        // If the notification is to be sent to the repairer and workshop staff
        if ($message->sender === $message->discussion->customer) {
            $recipients = [$message->discussion->repairer->owner];

            /** @var RepairerEmployee $repairerEmployee */
            foreach ($message->discussion->repairer->repairerEmployees as $repairerEmployee) {
                $recipients[] = $repairerEmployee->employee;
            }

            return $recipients;
        }

        // If the notification is to be sent to the customer
        return [$message->discussion->customer];
    }
}
