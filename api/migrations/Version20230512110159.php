<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230512110159 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Agenda schema';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('CREATE SEQUENCE repairer_exceptional_closure_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE repairer_opening_hours_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE repairer_exceptional_closure (id INT NOT NULL, repairer_id INT DEFAULT NULL, start_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, end_date TIMESTAMP(0) WITHOUT TIME ZONE NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_8015004D47C5DFEE ON repairer_exceptional_closure (repairer_id)');
        $this->addSql('CREATE TABLE repairer_opening_hours (id INT NOT NULL, repairer_id INT DEFAULT NULL, day VARCHAR(255) NOT NULL, start_time VARCHAR(255) NOT NULL, end_time VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_EAD0603247C5DFEE ON repairer_opening_hours (repairer_id)');
        $this->addSql('ALTER TABLE repairer_exceptional_closure ADD CONSTRAINT FK_8015004D47C5DFEE FOREIGN KEY (repairer_id) REFERENCES repairer (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer_opening_hours ADD CONSTRAINT FK_EAD0603247C5DFEE FOREIGN KEY (repairer_id) REFERENCES repairer (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE appointment DROP duration');
        $this->addSql('ALTER TABLE repairer ADD duration_slot INT DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD number_of_slots INT DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer DROP rrule');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE repairer_exceptional_closure_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE repairer_opening_hours_id_seq CASCADE');
        $this->addSql('ALTER TABLE repairer_exceptional_closure DROP CONSTRAINT FK_8015004D47C5DFEE');
        $this->addSql('ALTER TABLE repairer_opening_hours DROP CONSTRAINT FK_EAD0603247C5DFEE');
        $this->addSql('DROP TABLE repairer_exceptional_closure');
        $this->addSql('DROP TABLE repairer_opening_hours');
        $this->addSql('ALTER TABLE repairer ADD rrule VARCHAR(255) DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer DROP duration_slot');
        $this->addSql('ALTER TABLE repairer DROP number_of_slots');
        $this->addSql('ALTER TABLE appointment ADD duration INT DEFAULT NULL');
    }
}
