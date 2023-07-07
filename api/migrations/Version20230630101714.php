<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230630101714 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add invoice to maintenance';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE maintenance ADD invoice_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE maintenance ADD CONSTRAINT FK_2F84F8E92989F1FD FOREIGN KEY (invoice_id) REFERENCES media_object (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_2F84F8E92989F1FD ON maintenance (invoice_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE maintenance DROP CONSTRAINT FK_2F84F8E92989F1FD');
        $this->addSql('DROP INDEX IDX_2F84F8E92989F1FD');
        $this->addSql('ALTER TABLE maintenance DROP invoice_id');
    }
}
