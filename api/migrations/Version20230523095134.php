<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230523095134 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Remove accepted field by an appointment status';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE appointment ADD status VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE appointment DROP accepted');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE appointment ADD accepted BOOLEAN DEFAULT NULL');
        $this->addSql('ALTER TABLE appointment DROP status');
    }
}
