<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230414121420 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add intervention and repairer_intervention tables';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE intervention_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE SEQUENCE repairer_intervention_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE intervention (id INT NOT NULL, description VARCHAR(255) NOT NULL, is_admin BOOLEAN NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE TABLE repairer_intervention (id INT NOT NULL, repairer_id INT DEFAULT NULL, intervention_id INT DEFAULT NULL, price INT NOT NULL, PRIMARY KEY(id))');
        $this->addSql('CREATE INDEX IDX_4DCEB81F47C5DFEE ON repairer_intervention (repairer_id)');
        $this->addSql('CREATE INDEX IDX_4DCEB81F8EAE3863 ON repairer_intervention (intervention_id)');
        $this->addSql('ALTER TABLE repairer_intervention ADD CONSTRAINT FK_4DCEB81F47C5DFEE FOREIGN KEY (repairer_id) REFERENCES repairer (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('ALTER TABLE repairer_intervention ADD CONSTRAINT FK_4DCEB81F8EAE3863 FOREIGN KEY (intervention_id) REFERENCES intervention (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('DROP SEQUENCE intervention_id_seq CASCADE');
        $this->addSql('DROP SEQUENCE repairer_intervention_id_seq CASCADE');
        $this->addSql('ALTER TABLE repairer_intervention DROP CONSTRAINT FK_4DCEB81F47C5DFEE');
        $this->addSql('ALTER TABLE repairer_intervention DROP CONSTRAINT FK_4DCEB81F8EAE3863');
        $this->addSql('DROP TABLE intervention');
        $this->addSql('DROP TABLE repairer_intervention');
    }
}
