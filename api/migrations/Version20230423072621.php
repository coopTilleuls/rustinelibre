<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230423072621 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add owner in media objects';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE media_object ADD owner_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE media_object ADD CONSTRAINT FK_14D431327E3C61F9 FOREIGN KEY (owner_id) REFERENCES "user" (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_14D431327E3C61F9 ON media_object (owner_id)');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE media_object DROP CONSTRAINT FK_14D431327E3C61F9');
        $this->addSql('DROP INDEX IDX_14D431327E3C61F9');
        $this->addSql('ALTER TABLE media_object DROP owner_id');
    }
}
