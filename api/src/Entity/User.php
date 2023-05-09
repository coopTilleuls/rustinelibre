<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\OpenApi\Model;
use App\Repository\UserRepository;
use App\User\Filter\UserSearchFilter;
use App\User\StateProvider\CurrentUserProvider;
use App\User\StateProvider\CustomersProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    normalizationContext: ['groups' => [self::USER_READ]],
    denormalizationContext: ['groups' => [self::USER_WRITE]]
)]
#[Get(security: "is_granted('ROLE_ADMIN') or (object == user and user.emailConfirmed == true) or (is_granted('ROLE_BOSS') and is_granted('CUSTOMER_READ', object))")]
#[Post(security: "is_granted('ROLE_ADMIN') or !user")]
#[Put(security: "is_granted('ROLE_ADMIN') or (object == user and user.emailConfirmed == true)")]
#[Get(
    uriTemplate: '/me',
    openapi: new Model\Operation(
        summary: 'Retrieves the current User ressource',
        description: 'Retrieves the current User ressource'),
    security: "is_granted('ROLE_ADMIN') or (object == user and user.emailConfirmed == true)",
    provider: CurrentUserProvider::class,
)]
#[GetCollection(security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')")]
#[GetCollection(
    name: 'Get customers list',
    uriTemplate: '/customers',
    openapi: new Model\Operation(
        summary: 'Retrieves customers from my repair\'s shop',
        description: 'Retrieves customers from my repair\'s shop'),
    security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')",
    provider: CustomersProvider::class,
)]
#[Delete(security: "is_granted('ROLE_ADMIN') or (object == user)")]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
#[ApiFilter(UserSearchFilter::class)]
#[ApiFilter(SearchFilter::class, properties: ['firstName' => 'ipartial', 'lastName' => 'ipartial'])]
#[ApiFilter(OrderFilter::class, properties: ['id'], arguments: ['orderParameterName' => 'order'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    private const EMAIL_MAX_LENGTH = 180;
    public const USER_READ = 'user_read';
    public const CUSTOMER_READ = 'customer_read';
    public const USER_WRITE = 'user_write';
    public const PASSWORD_REGEX = '/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])(?=.*[@$!%*#?.+=;\\\:\\/,_"&])[A-Za-z\d@$!%*#?.+=;,\\\:\\/_"&]{12,}$/i';

    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\Column(type: 'integer', unique: true)]
    #[ORM\GeneratedValue]
    #[Groups([self::USER_READ, self::CUSTOMER_READ])]
    public int $id;

    #[Assert\Length(max: self::EMAIL_MAX_LENGTH)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[ORM\Column(length: 180, unique: true)]
    #[Groups([self::USER_READ, self::USER_WRITE, RepairerEmployee::EMPLOYEE_READ, self::CUSTOMER_READ])]
    public ?string $email = null;

    #[ORM\Column]
    #[Groups([self::USER_READ])]
    public array $roles = [];

    #[Assert\Type('boolean')]
    #[ORM\Column(type: 'boolean', nullable: false)]
    #[Groups([self::USER_READ])]
    public bool $emailConfirmed = false;

    #[ORM\Column(type: 'string')]
    public ?string $password = null;

    #[Assert\Regex(self::PASSWORD_REGEX)]
    #[Groups([self::USER_READ, self::USER_WRITE])]
    public ?string $plainPassword = null;

    #[ORM\OneToOne(mappedBy: 'owner', cascade: ['persist', 'remove'])]
    #[Groups([self::USER_READ])]
    public ?Repairer $repairer = null;

    #[Assert\NotBlank]
    #[Assert\Length(
        min : 2,
        max : 50,
    )]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::USER_READ, self::USER_WRITE, RepairerEmployee::EMPLOYEE_READ, self::CUSTOMER_READ, Appointment::APPOINTMENT_READ])]
    public ?string $lastName = null;

    #[Assert\NotBlank]
    #[Assert\Length(
        min : 2,
        max : 50,
    )]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::USER_READ, self::USER_WRITE, RepairerEmployee::EMPLOYEE_READ, self::CUSTOMER_READ, Appointment::APPOINTMENT_READ])]
    public ?string $firstName = null;

    #[ORM\OneToOne(mappedBy: 'employee', cascade: ['persist', 'remove'])]
    #[Groups([self::USER_READ])]
    public ?RepairerEmployee $repairerEmployee = null;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Bike::class, cascade: ['persist', 'remove'])]
    #[Groups([self::USER_READ])]
    public Collection $bikes;

    public function __construct()
    {
        $this->bikes = new ArrayCollection();
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function eraseCredentials()
    {
        $this->plainPassword = null;
    }

    public function isAdmin(): bool
    {
        if (in_array('ROLE_ADMIN', $this->roles)) {
            return true;
        }

        return false;
    }

    public function isBoss(): bool
    {
        if (in_array('ROLE_BOSS', $this->roles)) {
            return true;
        }

        return false;
    }

    public function isEmployee(): bool
    {
        if (in_array('ROLE_EMPLOYEE', $this->roles)) {
            return true;
        }

        return false;
    }

    public function getPassword(): string
    {
        return $this->password;
    }
}
