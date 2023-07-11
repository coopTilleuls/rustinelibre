<?php

declare(strict_types=1);

namespace App\Notifications;

use App\Entity\User;

class Notification
{
    public const DEFAULT_ICON = 'https://cdn-icons-png.flaticon.com/512/565/565422.png';

    public function __construct(public User $recipient, public string $title, public string $body, public ?string $color = '#f45342', public ?string $icon = self::DEFAULT_ICON, public ?string $image = self::DEFAULT_ICON, public ?array $params = [])
    {
    }
}
