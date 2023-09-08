<?php

declare(strict_types=1);

namespace App\Notifications;

use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\CloudMessage;
use Psr\Log\LoggerInterface;

final readonly class FirebaseNotifier
{
    public function __construct(private Messaging $messaging, private LoggerInterface $logger, private string $webAppUrl)
    {
    }

    public function sendNotification(Notification $notification): void
    {
        if (!$notification->recipient->firebaseToken) {
            $this->logger->alert(sprintf('Notification not send, user %s does not have firebase token', $notification->recipient->id));

            return;
        }

        $message = CloudMessage::fromArray([
            'token' => $notification->recipient->firebaseToken,
            'data' => [
                'title' => $notification->title,
                'body' => $notification->body,
                'image' => sprintf('%s/%s', $this->webAppUrl, $notification->image),
                'icon' => sprintf('%s/%s', $this->webAppUrl, $notification->icon),
                'route' => array_key_exists('route', $notification->params) ? $notification->params['route'] : '/',
            ],
            'webpush' => [
                'headers' => [
                    'Urgency' => 'high',
                ],
            ],
        ]);

        try {
            $this->messaging->send($message);
        } catch (\Exception $exception) {
            $this->logger->alert(sprintf('Notification not send, error : %s', $exception->getMessage()));
        }
    }
}
