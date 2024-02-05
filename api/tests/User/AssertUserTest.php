<?php

declare(strict_types=1);

namespace App\Tests\User;

use App\Entity\User;
use App\Tests\AbstractTestCase;
use Hautelook\AliceBundle\PhpUnit\RefreshDatabaseTrait;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Contracts\Translation\TranslatorInterface;

class AssertUserTest extends AbstractTestCase
{
    use RefreshDatabaseTrait;

    private TranslatorInterface $translator;

    public function setUp(): void
    {
        parent::setUp();
        $this->translator = static::getContainer()->get(TranslatorInterface::class);
    }

    public function testBadEmail(): void
    {
        $client = self::createClient();

        $client->request('POST', '/users', [
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
            'hydra:description' => sprintf('email: %s', $this->translator->trans('user.email.valid', domain: 'validators')),
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
            'hydra:description' => sprintf('plainPassword: %s', $this->translator->trans('user.password.regex', domain: 'validators')),
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
            'hydra:description' => sprintf('firstName: %s', $this->translator->trans('user.firstName.not_blank', domain: 'validators')),
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
            'hydra:description' => sprintf('firstName: %s', $this->translator->trans('user.firstName.min_length', domain: 'validators')),
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
            'hydra:description' => sprintf('firstName: %s', $this->translator->trans('user.firstName.max_length', domain: 'validators')),
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
            'hydra:description' => sprintf('lastName: %s', $this->translator->trans('user.lastName.not_blank', domain: 'validators')),
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
            'hydra:description' => sprintf('lastName: %s', $this->translator->trans('user.lastName.min_length', domain: 'validators')),
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
            'hydra:description' => sprintf('lastName: %s', $this->translator->trans('user.lastName.max_length', domain: 'validators')),
        ]);
    }

    public function testPasswordRegex(): void
    {
        $pattern = User::PASSWORD_REGEX;

        // Password should contain at least 12 characters, 1 uppercase, 1 lowercase, 1 special character and 1 number
        $result = preg_match($pattern, 'badpassword');
        self::assertSame(0, $result);
        $result = preg_match($pattern, 'shortpass1,');
        self::assertSame(0, $result);
        $result = preg_match($pattern, 'Badpassword');
        self::assertSame(0, $result);
        $result = preg_match($pattern, 'Badpassword1WithoutSpecial');
        self::assertSame(0, $result);
        $result = preg_match($pattern, 'BadPasswordWithoutNumber.');
        self::assertSame(0, $result);
        $result = preg_match($pattern, 'Goodpassword2,');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2;');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'goodPassword2!');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2@');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2/');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2\\');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2#');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2?');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2=');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2$');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2%');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2*');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2+');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2:');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2_');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2&');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2"');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2.');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2»');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2\'');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2(');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2)');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2-');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2<');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2>');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2[');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2]');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2^');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2`');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2{');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2|');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2}');
        self::assertSame(1, $result);
        $result = preg_match($pattern, 'Goodpassword2~');
        self::assertSame(1, $result);
        // Test with multiple characters
        $result = preg_match($pattern, 'zj8Ub$MH^X=g_eG');
        self::assertSame(1, $result);
    }

    public function testUniqueEmail(): void
    {
        $client = self::createClient();

        $client->request('POST', '/users', [
            'headers' => ['Content-Type' => 'application/json'],
            'json' => [
                'email' => 'user1@test.com',
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
            'hydra:description' => sprintf('email: %s', $this->translator->trans('user.email.unique', domain: 'validators')),
        ]);
    }
}
