<?php

declare(strict_types=1);

namespace App\Tests\Resources\Services\Faker;

use Faker\Generator;
use Faker\Provider\Base;

final class AutoDiagnosticPrestationProvider extends Base
{
    public function __construct(Generator $generator)
    {
        parent::__construct($generator);
    }

    public static function autoDiagnosticRandomPrestation(): string
    {
        $prestationArray = ['Entretien classique', 'Électrifier mon vélo', 'Problème de frein', 'Problème de pneu', 'Problème de roue', 'Problème de vitesse', 'Autre prestation'];
        $randomIndex = array_rand($prestationArray);

        return $prestationArray[$randomIndex];
    }
}
