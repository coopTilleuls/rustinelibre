<?php

declare(strict_types=1);

namespace App\Tests\User;

use App\Entity\User;
use App\Repository\UserRepository;
use App\Tests\AbstractTestCase;

class UserDisabledTest extends AbstractTestCase
{
    private User $user;

    public function setUp(): void
    {
        parent::setUp();

        $this->user = static::getContainer()->get(UserRepository::class)->findOneBy(['emailConfirmed' => false]);
    }

    public function testDeleteUserNotConfirmedWork(): void
    {
        self::createClientWithUser($this->user)->request('DELETE', sprintf('/users/%d', $this->user->id));
        $this->assertResponseIsSuccessful();
    }
}
