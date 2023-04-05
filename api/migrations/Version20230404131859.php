<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230404131859 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add new fields to repairer table';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE repairer ADD opening_hours TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD optional_page TEXT DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD enabled BOOLEAN NOT NULL');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE repairer DROP opening_hours');
        $this->addSql('ALTER TABLE repairer DROP optional_page');
        $this->addSql('ALTER TABLE repairer DROP enabled');
    }
}
