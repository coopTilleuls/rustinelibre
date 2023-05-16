<?php

declare(strict_types=1);

namespace App\Tests\Trait;

use App\Entity\Repairer;
use App\Repository\RepairerRepository;

trait RepairerTrait
{
    private RepairerRepository $repairerRepository;

    public function getRepairer(): ?Repairer
    {
        return $this->repairerRepository->findOneBy([]);
    }
}
