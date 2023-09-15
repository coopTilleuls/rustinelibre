<?php

declare(strict_types=1);

namespace App\Repairers\Dto;

use App\Entity\Repairer;
use App\Entity\User;
use Symfony\Component\Serializer\Annotation\Groups;

class UpdateRepairerBossDto
{
    #[Groups([Repairer::REPAIRER_WRITE])]
    public ?User $newBoss = null;
}
