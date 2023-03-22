<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
    ]
)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    private const EMAIL_MAX_LENGTH = 180;

    #[ORM\Id]
    #[ORM\Column(type: 'integer', unique: true)]
    #[ORM\GeneratedValue]
    private int $id;

    #[Assert\Length(max: self::EMAIL_MAX_LENGTH)]
    #[Assert\NotBlank]
    #[Assert\Email]
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[Assert\Type('boolean')]
    #[ORM\Column(type: 'boolean', nullable: false)]
    private bool $emailConfirmed = false;

    #[ORM\Column(type: 'string')]
    private ?string $password = null;

    private ?string $plainPassword = null;

    #[ORM\OneToMany(mappedBy: 'owner', targetEntity: Repairer::class, orphanRemoval: true)]
    private Collection $repairers;

    public function __construct()
    {
        $this->repairers = new ArrayCollection();
    }

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

    /**
     * @see UserInterface
     */
    public function eraseCredentials()
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    /**
     * @return Collection<int, Repairer>
     */
    public function getRepairers(): Collection
    {
        return $this->repairers;
    }

    public function addRepairer(Repairer $repairer): self
    {
        if (!$this->repairers->contains($repairer)) {
            $this->repairers->add($repairer);
            $repairer->setOwner($this);
        }

        return $this;
    }

    public function removeRepairer(Repairer $repairer): self
    {
        if ($this->repairers->removeElement($repairer)) {
            // set the owning side to null (unless already changed)
            if ($repairer->getOwner() === $this) {
                $repairer->setOwner(null);
            }
        }

        return $this;
    }
}
