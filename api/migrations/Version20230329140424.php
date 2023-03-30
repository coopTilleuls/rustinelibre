<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230329140424 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add gps point';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE repairer ADD gps_point geography(POINT, 4326) DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD first_slot_available TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE repairer DROP gps_point');
        $this->addSql('ALTER TABLE repairer DROP first_slot_available');
    }
}
