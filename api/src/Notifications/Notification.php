<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Entity\User;

class Notification
{
    public const DEFAULT_ICON = 'https://cdn-icons-png.flaticon.com/512/565/565422.png';

    public User $recipient;
    public string $title;
    public string $body;
    public string $color;
    public string $image;
    public string $icon;
    public array $params = [];

    public function __construct(User $recipient, string $title, string $body, ?string $color = '#f45342', ?string $icon = self::DEFAULT_ICON, ?string $image= self::DEFAULT_ICON, ?array $params = [])
    {
        $this->recipient = $recipient;
        $this->title = $title;
        $this->body = $body;
        $this->color = $color;
        $this->icon = $icon;
        $this->image = $image;
        $this->params = $params;
    }
}
