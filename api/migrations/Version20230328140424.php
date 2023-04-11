<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230328140424 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add extension postgis';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE EXTENSION if not exists Postgis');
    }

    public function down(Schema $schema): void
    {
    }
}
