<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230426134528 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add autodiag table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SEQUENCE auto_diagnostic_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE auto_diagnostic (id INT NOT NULL, appointment_id INT NOT NULL, photo_id INT DEFAULT NULL, prestation VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_90E16CB2E5B533F9 ON auto_diagnostic (appointment_id)');
        $this->addSql('CREATE INDEX IDX_90E16CB27E9E4C8C ON auto_diagnostic (photo_id)');
        $this->addSql('ALTER TABLE auto_diagnostic ADD CONSTRAINT FK_90E16CB2E5B533F9 FOREIGN KEY (appointment_id) REFERENCES appointment (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE auto_diagnostic ADD CONSTRAINT FK_90E16CB27E9E4C8C FOREIGN KEY (photo_id) REFERENCES media_object (id) ON DELETE SET NULL NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER INDEX idx_2f84f8e93da5256d RENAME TO IDX_2F84F8E97E9E4C8C');
        $this->addSql('ALTER TABLE repairer ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN repairer.created_at IS \'(DC2Type:datetime_immutable)\'');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE auto_diagnostic_id_seq CASCADE');
        $this->addSql('ALTER TABLE auto_diagnostic DROP CONSTRAINT FK_90E16CB2E5B533F9');
        $this->addSql('ALTER TABLE auto_diagnostic DROP CONSTRAINT FK_90E16CB27E9E4C8C');
        $this->addSql('DROP TABLE auto_diagnostic');
        $this->addSql('ALTER TABLE repairer ALTER created_at TYPE TIMESTAMP(0) WITHOUT TIME ZONE');
        $this->addSql('COMMENT ON COLUMN repairer.created_at IS NULL');
        $this->addSql('ALTER INDEX idx_2f84f8e97e9e4c8c RENAME TO idx_2f84f8e93da5256d');
    }
}
