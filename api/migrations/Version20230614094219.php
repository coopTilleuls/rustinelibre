<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230614094219 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add contact columns';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE contact ADD already_read BOOLEAN NOT NULL');
        $this->addSql('ALTER TABLE contact ADD created_at TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL');
        $this->addSql('COMMENT ON COLUMN contact.created_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE contact DROP already_read');
        $this->addSql('ALTER TABLE contact DROP created_at');
    }
}
