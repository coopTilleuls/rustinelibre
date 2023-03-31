<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

final class Version20230330124909 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create repair solution schema';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SEQUENCE repairer_type_id_seq INCREMENT BY 1 MINVALUE 1 START 1');
        $this->addSql('CREATE TABLE repairer_type (id INT NOT NULL, name VARCHAR(255) NOT NULL, PRIMARY KEY(id))');
        $this->addSql('ALTER TABLE repairer ADD repairer_type_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE repairer ADD CONSTRAINT FK_4A73F2BFD2C6BD92 FOREIGN KEY (repairer_type_id) REFERENCES repairer_type (id) NOT DEFERRABLE INITIALLY IMMEDIATE');
        $this->addSql('CREATE INDEX IDX_4A73F2BFD2C6BD92 ON repairer (repairer_type_id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE SCHEMA public');
        $this->addSql('ALTER TABLE repairer DROP CONSTRAINT FK_4A73F2BFD2C6BD92');
        $this->addSql('DROP SEQUENCE repairer_type_id_seq CASCADE');
        $this->addSql('DROP TABLE repairer_type');
        $this->addSql('DROP INDEX IDX_4A73F2BFD2C6BD92');
        $this->addSql('ALTER TABLE repairer DROP repairer_type_id');
    }
}
