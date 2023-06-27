<?php

declare(strict_types=1);

namespace App\Bike\Validator;

use Symfony\Component\Validator\Constraint;

#[\Attribute]
class BikeOwner extends Constraint
{
    public string $message = 'bike.owner';
}
