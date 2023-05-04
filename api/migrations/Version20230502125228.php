<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230502125228 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add accepted to appointment';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE appointment ADD accepted BOOLEAN DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE appointment DROP accepted');
    }
}
