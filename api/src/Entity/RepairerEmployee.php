<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Employees\Dto\CreateUserEmployeeDto;
use App\Employees\State\CreateUserEmployeeProcessor;
use App\Employees\State\UpdateUserEmployeeProcessor;
use App\Repository\RepairerEmployeeRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: RepairerEmployeeRepository::class)]
#[ApiResource(
    normalizationContext: ['groups' => [self::EMPLOYEE_READ]],
    denormalizationContext: ['groups' => [self::EMPLOYEE_WRITE]],
    extraProperties: [
        'standard_put',
    ]
)]
#[Get(security: "is_granted('ROLE_ADMIN') or object.repairer == user.repairer")]
#[GetCollection(security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')")]
#[Post(
    security: "is_granted('ROLE_ADMIN') or is_granted('ROLE_BOSS')",
    input: CreateUserEmployeeDto::class,
    processor: CreateUserEmployeeProcessor::class
)]
#[Put(
    uriTemplate: '/employee_and_user/{id}',
    security: "is_granted('IS_AUTHENTICATED_FULLY') and (is_granted('ROLE_ADMIN') or object.repairer == user.repairer)",
    input: CreateUserEmployeeDto::class,
    processor: UpdateUserEmployeeProcessor::class
)]
#[Put(security: "is_granted('ROLE_ADMIN') or object.repairer == user.repairer")]
#[Delete(security: "is_granted('IS_AUTHENTICATED_FULLY') and (is_granted('ROLE_ADMIN') or object.repairer == user.repairer)")]
#[ApiFilter(SearchFilter::class, properties: ['repairer' => 'exact'])]
class RepairerEmployee
{
    public const EMPLOYEE_READ = 'employee_read';
    public const EMPLOYEE_WRITE = 'employee_write';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups([self::EMPLOYEE_READ])]
    public ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'repairerEmployees')]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::EMPLOYEE_READ, self::EMPLOYEE_WRITE, User::USER_READ])]
    public ?Repairer $repairer = null;

    #[ORM\OneToOne(inversedBy: 'repairerEmployee', cascade: ['persist'])]
    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[Groups([self::EMPLOYEE_READ, self::EMPLOYEE_WRITE])]
    public ?User $employee = null;

    #[ORM\Column]
    #[Groups([self::EMPLOYEE_READ, self::EMPLOYEE_WRITE])]
    public ?bool $enabled = true;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    #[Groups([self::EMPLOYEE_READ, self::EMPLOYEE_WRITE])]
    public ?\DateTimeInterface $sinceDate;

    public function __construct()
    {
        $this->sinceDate = new \DateTimeImmutable();
    }
}
