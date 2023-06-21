<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230619124811 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add appointment address';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE appointment ADD address VARCHAR(255) DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE appointment DROP address');
    }
}
