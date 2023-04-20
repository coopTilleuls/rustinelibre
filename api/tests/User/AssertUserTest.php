<?php

declare(strict_types=1);

namespace App\Tests\User;

use App\Entity\User;
use App\Tests\AbstractTestCase;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Component\HttpFoundation\Response;

class AssertUserTest extends AbstractTestCase
{
    use RefreshDatabaseTrait;

    public function testBadEmail(): void
    {
        $client = self::createClient();

        $response = $client->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'bad@les-tilleuls',
                'plainPassword' => 'Test1passwordOk!',
                'firstName' => 'Leon',
                'lastName' => 'Bruxelles',
            ],
        ]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'email: This value is not a valid email address.',
        ]);
    }

    public function testBadPassword(): void
    {
        $client = self::createClient();

        $client->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'good@les-tilleuls.coop',
                'plainPassword' => 'test',
                'firstName' => 'Leon',
                'lastName' => 'Bruxelles',
            ],
        ]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'plainPassword: This value is not valid.',
        ]);
    }

    public function testGoodEmailAndGoodPassword(): void
    {
        $client = self::createClient();

        $client->request('POST', '/users', [
           'headers' => ['Content-Type' => 'application/json'],
           'json' => [
               'email' => 'good@les-tilleuls.coop',
               // Password with at least one uppercase, one lowercase, one number and one special character
               'plainPassword' => 'Test1passwordOk!',
               'firstName' => 'Leon',
               'lastName' => 'Bruxelles',
           ],
        ]);

        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(Response::HTTP_CREATED);
    }

    public function testWithoutFirstName(): void
    {
        $client = self::createClient();

        $client->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'good@les-tilleuls.coop',
                'plainPassword' => 'Test1passwordOk!',
                'lastName' => 'Bruxelles',
            ],
        ]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'firstName: This value should not be blank.',
        ]);
    }

    public function testWithShortFirstName(): void
    {
        $client = self::createClient();

        $client->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'good@les-tilleuls.coop',
                'plainPassword' => 'Test1passwordOk!',
                'firstName' => 'A',
                'lastName' => 'Bruxelles',
            ],
        ]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'firstName: This value is too short. It should have 2 characters or more.',
        ]);
    }

    public function testWithLongFirstName(): void
    {
        $client = self::createClient();

        $client->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'good@les-tilleuls.coop',
                'plainPassword' => 'Test1passwordOk!',
                // 52 characters given
                'firstName' => 'Nam quis nulla. Integer malesuada. In in enim a arcu',
                'lastName' => 'Bruxelles',
            ],
        ]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'firstName: This value is too long. It should have 50 characters or less.',
        ]);
    }

    public function testWithoutLastName(): void
    {
        $client = self::createClient();

        $client->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'good@les-tilleuls.coop',
                'plainPassword' => 'Test1passwordOk!',
                'firstName' => 'Leon',
            ],
        ]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'lastName: This value should not be blank.',
        ]);
    }

    public function testWithShortLastName(): void
    {
        $client = self::createClient();

        $client->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'good@les-tilleuls.coop',
                'plainPassword' => 'Test1passwordOk!',
                'firstName' => 'Leon',
                'lastName' => 'A',
            ],
        ]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'lastName: This value is too short. It should have 2 characters or more.',
        ]);
    }

    public function testWithLongLastName(): void
    {
        $client = self::createClient();

        $client->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'good@les-tilleuls.coop',
                'plainPassword' => 'Test1passwordOk!',
                'firstName' => 'Leon',
                'lastName' => 'Nam quis nulla. Integer malesuada. In in enim a arcu',
            ],
        ]);

        self::assertResponseStatusCodeSame(RESPONSE::HTTP_UNPROCESSABLE_ENTITY);
        self::assertJsonContains([
            '@context' => '/contexts/ConstraintViolationList',
            '@type' => 'ConstraintViolationList',
            'hydra:title' => 'An error occurred',
            'hydra:description' => 'lastName: This value is too long. It should have 50 characters or less.',
        ]);
    }

    public function testPasswordRegex(): void
    {
        $pattern = User::PASSWORD_REGEX;

        //Password should contain at least 12 characters, 1 uppercase, 1 lowercase, 1 special character and 1 number
        $result= preg_match($pattern, "badpassword");
        self::assertSame(0, $result);
        $result= preg_match($pattern, "shortpass1,");
        self::assertSame(0, $result);
        $result= preg_match($pattern, "Badpassword");
        self::assertSame(0, $result);
        $result= preg_match($pattern, "Badpassword1WithoutSpecial");
        self::assertSame(0, $result);
        $result= preg_match($pattern, "BadPasswordWithoutNumber.");
        self::assertSame(0, $result);
        $result= preg_match($pattern, "Goodpassword2,");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2;");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "goodPassword2!");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2@");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2/");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2\\");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2#");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2?");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2=");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2$");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2%");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2*");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2+");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2:");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2_");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2&");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2\"");
        self::assertSame(1, $result);
        $result= preg_match($pattern, "Goodpassword2.");
        self::assertSame(1, $result);
        //Test with multiple characters
        $result= preg_match($pattern, "Multiple/;.Password223");
        self::assertSame(1, $result);
    }
}
