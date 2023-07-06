<?php

declare(strict_types=1);

namespace App\Notifications;

use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\AndroidConfig;
use Kreait\Firebase\Messaging\ApnsConfig;
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
            'notification' => [
                'title' => $notification->title,
                'body' => $notification->body,
            ],
            'data' => [
                'image' => $notification->image,
                'icon' => $notification->icon,
            ],
            'webpush' => [
                'headers' => [
                    'Urgency' => 'high',
                ],
            ],
        ]);

        $androidConfig = AndroidConfig::fromArray([
            'ttl' => '7200s',
            'priority' => 'normal',
            'notification' => [
                'title' => $notification->title,
                'body' => $notification->body,
                'icon' => $notification->icon,
                'color' => $notification->color,
                'sound' => 'default',
            ],
            'data' => [
                'route' => array_key_exists('route', $notification->params) ? $notification->params['route'] : $this->webAppUrl,
            ],
        ]);

        $message = $message->withAndroidConfig($androidConfig);

        $config = ApnsConfig::fromArray([
            'headers' => [
                'apns-priority' => '10',
            ],
            'payload' => [
                'aps' => [
                    'alert' => [
                        'title' => $notification->title,
                        'body' => $notification->body,
                    ],
                    'badge' => 42,
                    'sound' => 'default',
                ],
            ],
        ]);

        $message = $message->withApnsConfig($config);

        $this->messaging->send($message);
    }
}
