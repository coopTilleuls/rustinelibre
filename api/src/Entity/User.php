<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\OpenApi\Model;
use App\Repository\UserRepository;
use App\User\StateProvider\CurrentUserProvider;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    normalizationContext: ['groups' => [self::USER_READ]],
    denormalizationContext: ['groups' => [self::USER_WRITE]]
)]
#[Get(security: "is_granted('ROLE_ADMIN') or object == user")]
#[Post(security: "is_granted('ROLE_ADMIN') or !user")]
#[Put(security: "is_granted('ROLE_ADMIN') or object == user")]
#[Get(
    uriTemplate: '/me',
    openapi: new Model\Operation(
        summary: 'Retrieves the current User ressource',
        description: 'Retrieves the current User ressource'),
    security: "is_granted('IS_AUTHENTICATED_FULLY')",
    provider: CurrentUserProvider::class,
)]
#[GetCollection(security: "is_granted('ROLE_ADMIN')")]
#[Delete(security: "is_granted('ROLE_ADMIN') or object == user")]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    private const EMAIL_MAX_LENGTH = 180;
    public const USER_READ = 'user_read';
    public const USER_WRITE = 'user_write';

    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\Column(type: 'integer', unique: true)]
    #[ORM\GeneratedValue]
    #[Groups([self::USER_READ])]
    public int $id;

    #[Assert\Length(max: self::EMAIL_MAX_LENGTH)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[ORM\Column(length: 180, unique: true)]
    #[Groups([self::USER_READ, self::USER_WRITE, RepairerEmployee::EMPLOYEE_READ])]
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

    #[Assert\Regex("/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])(?=.*[@$!%*?&\\/])[A-Za-z\d@$!%*?&\\/]{12,}$/i")]
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
    #[Groups([self::USER_READ, self::USER_WRITE, RepairerEmployee::EMPLOYEE_READ])]
    public ?string $lastName = null;

    #[Assert\NotBlank]
    #[Assert\Length(
        min : 2,
        max : 50,
    )]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::USER_READ, self::USER_WRITE, RepairerEmployee::EMPLOYEE_READ])]
    public ?string $firstName = null;

    #[ORM\OneToOne(mappedBy: 'employee', cascade: ['persist', 'remove'])]
    #[Groups([self::USER_READ])]
    public ?RepairerEmployee $repairerEmployee = null;

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

    public function setRepairerEmployee(RepairerEmployee $repairerEmployee): self
    {
        // set the owning side of the relation if necessary
        if ($repairerEmployee->employee !== $this) {
            $repairerEmployee->setEmployee($this);
        }

        $this->repairerEmployee = $repairerEmployee;

        return $this;
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
