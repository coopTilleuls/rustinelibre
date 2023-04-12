<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230412080146 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add gps_point';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE repairer ADD gps_point geography(POINT, 4326) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE repairer DROP gps_point');
    }
}
