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
#[Get(uriTemplate: '/me', security: "is_granted('IS_AUTHENTICATED_FULLY')", provider: CurrentUserProvider::class)]
#[GetCollection(security: "is_granted('ROLE_ADMIN')")]
#[Delete(security: "is_granted('ROLE_ADMIN') or object == user")]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    private const EMAIL_MAX_LENGTH = 180;
    public CONST USER_READ = 'user_read';
    public CONST USER_WRITE = 'user_write';

    #[ApiProperty(identifier: true)]
    #[ORM\Id]
    #[ORM\Column(type: 'integer', unique: true)]
    #[ORM\GeneratedValue]
    #[Groups([self::USER_READ])]
    private int $id;

    #[Assert\Length(max: self::EMAIL_MAX_LENGTH)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[ORM\Column(length: 180, unique: true)]
    #[Groups([self::USER_READ, self::USER_WRITE, RepairerEmployee::EMPLOYEE_READ])]
    private ?string $email = null;

    #[ORM\Column]
    #[Groups([self::USER_READ])]
    private array $roles = [];

    #[Assert\Type('boolean')]
    #[ORM\Column(type: 'boolean', nullable: false)]
    #[Groups([self::USER_READ])]
    private bool $emailConfirmed = false;

    #[ORM\Column(type: 'string')]
    private ?string $password = null;

    #[Assert\Regex("/^(?=.*[A-Z])(?=.*\d)(?=.*[a-z])(?=.*[@$!%*?&\\/])[A-Za-z\d@$!%*?&\\/]{12,}$/")]
    #[Groups([self::USER_READ, self::USER_WRITE])]
    private ?string $plainPassword = null;

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
    private ?string $lastName = null;

    #[Assert\NotBlank]
    #[Assert\Length(
        min : 2,
        max : 50,
    )]
    #[ORM\Column(length: 255, nullable: true)]
    #[Groups([self::USER_READ, self::USER_WRITE, RepairerEmployee::EMPLOYEE_READ])]
    private ?string $firstName = null;

    #[ORM\OneToOne(mappedBy: 'employee', cascade: ['persist', 'remove'])]
    #[Groups([self::USER_READ])]
    private ?RepairerEmployee $repairerEmployee = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
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

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function isEmailConfirmed(): bool
    {
        return $this->emailConfirmed;
    }

    public function setEmailConfirmed(bool $emailConfirmed): void
    {
        $this->emailConfirmed = $emailConfirmed;
    }

    public function getPlainPassword(): ?string
    {
        return $this->plainPassword;
    }

    public function setPlainPassword(?string $plainPassword): void
    {
        $this->plainPassword = $plainPassword;
    }

    public function eraseCredentials()
    {
        $this->plainPassword = null;
    }

    public function getRepairer(): ?Repairer
    {
        return $this->repairer;
    }

    public function setRepairer(?Repairer $repairer): void
    {
        $this->repairer = $repairer;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(?string $lastName): self
    {
        $this->lastName = $lastName;

        return $this;
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(?string $firstName): self
    {
        $this->firstName = $firstName;

        return $this;
    }

    public function getRepairerEmployee(): ?RepairerEmployee
    {
        return $this->repairerEmployee;
    }

    public function setRepairerEmployee(RepairerEmployee $repairerEmployee): self
    {
        // set the owning side of the relation if necessary
        if ($repairerEmployee->getEmployee() !== $this) {
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
}
