<?php

declare(strict_types=1);

namespace App\Notifications;

use Kreait\Firebase\Contract\Messaging;
use Kreait\Firebase\Messaging\AndroidConfig;
use Kreait\Firebase\Messaging\ApnsConfig;
use Kreait\Firebase\Messaging\CloudMessage;
use Kreait\Firebase\Messaging\WebPushConfig;
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

        $config = WebPushConfig::fromArray([
            'data' => [
                'title' => $notification->title,
                'body' => $notification->body,
                'image' => sprintf('%s/%s', $this->webAppUrl, $notification->image),
                'route' => array_key_exists('route', $notification->params) ? $notification->params['route'] : '/',
            ],
        ]);

        $message = CloudMessage::new()->withWebPushConfig($config);

        // $message = CloudMessage::fromArray([
        //     'token' => $notification->recipient->firebaseToken,
        //     'notification' => [
        //         'title' => $notification->title,
        //         'body' => $notification->body,
        //     ],
        //     'data' => [
        //         'title' => $notification->title,
        //         'body' => $notification->body,
        //         'image' => sprintf('%s/%s', $this->webAppUrl, $notification->image),
        //         'icon' => sprintf('%s/%s', $this->webAppUrl, $notification->icon),
        //         'route' => array_key_exists('route', $notification->params) ? $notification->params['route'] : '/',
        //     ],
        //     'webpush' => [
        //         'headers' => [
        //             'Urgency' => 'high',
        //         ],
        //     ],
        // ]);
        //
        // $androidConfig = AndroidConfig::fromArray([
        //     'ttl' => '7200s',
        //     'priority' => 'normal',
        //     'notification' => [
        //         'title' => $notification->title,
        //         'body' => $notification->body,
        //         'icon' => sprintf('%s/%s', $this->webAppUrl, $notification->icon),
        //         'color' => $notification->color,
        //         'sound' => 'default',
        //     ],
        //     'data' => [
        //         'badge' => sprintf('%s/%s', $this->webAppUrl, $notification->icon),
        //         'route' => array_key_exists('route', $notification->params) ? $notification->params['route'] : '/',
        //         'title' => $notification->title,
        //         'body' => $notification->body,
        //         'icon' => sprintf('%s/%s', $this->webAppUrl, $notification->icon),
        //         'color' => $notification->color,
        //         'sound' => 'default',
        //     ],
        // ]);
        //
        // $message = $message->withAndroidConfig($androidConfig);
        //
        // $config = ApnsConfig::fromArray([
        //     'headers' => [
        //         'apns-priority' => '10',
        //     ],
        //     'payload' => [
        //         'aps' => [
        //             'alert' => [
        //                 'title' => $notification->title,
        //                 'body' => $notification->body,
        //             ],
        //             'badge' => 42,
        //             'sound' => 'default',
        //         ],
        //     ],
        // ]);
        //
        // $message = $message->withApnsConfig($config);

        try {
            $this->messaging->send($message);
        } catch (\Exception $exception) {
            $this->logger->alert(sprintf('Notification not send, error : %s', $exception->getMessage()));
        }
    }
}
