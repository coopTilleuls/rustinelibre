<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230426083518 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add created at column in repairer table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE repairer ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE repairer DROP created_at');
    }
}
