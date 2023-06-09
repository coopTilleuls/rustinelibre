<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230609125415 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add number of the street';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE repairer ADD street_number VARCHAR(30) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE repairer DROP street_number');
    }
}
