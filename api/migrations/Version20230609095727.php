<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230609095727 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add RDV date creation';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE appointment ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE DEFAULT NULL');
        $this->addSql('COMMENT ON COLUMN appointment.created_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE appointment DROP created_at');
    }
}
